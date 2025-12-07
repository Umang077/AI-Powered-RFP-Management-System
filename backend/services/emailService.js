
const { smtpTransport, imapConfig } = require("../config/email.js");
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const Proposal = require("../models/Proposal");
const Vendor = require("../models/Vendor");
const { parseVendorEmail } = require("../services/aiService");

// sends outbound RFP emails to vendors using SMTP

const sendRfpEmail = (to, subject, body) => {
  return smtpTransport.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body
  });
};

// reads unread vendor reply emails via IMAP
// parses them using AI and saves structured proposals
const readVendorEmails = () => {
  const imap = new Imap(imapConfig);

  return new Promise((resolve, reject) => {

//triggered once IMAP successfully connects to Gmail
    imap.once("ready", () => {
      console.log("IMAP Ready - Connected to Gmail");
      //open the inbox in read-only mode=false
      imap.openBox("INBOX", false, () => {
        imap.search(["UNSEEN"], (err, results) => {
          if (!results || results.length === 0) {
            console.log("No new vendor emails");
            return resolve([]);
          }

          console.log("Total UNSEEN emails:", results.length);

          // pick only the latest unread email
          const latestEmailUid = results[results.length - 1];
          console.log("Processing only latest email UID:", latestEmailUid);

          const f = imap.fetch(latestEmailUid, { bodies: "" });

          f.on("message", (msg) => {
            // this event receives the raw email stream
            msg.on("body", async (stream) => {
              console.log("Reading new vendor email...");
              //convert raw stream → parsed email (text, from, html, etc.)
              const parsed = await simpleParser(stream);

              const emailText = parsed.text?.trim() || "";
              // Extract only the sender's email address
              const from = parsed.from?.value?.[0]?.address || parsed.from.text;

              console.log("NEW EMAIL FROM:", from);
              console.log("EMAIL TEXT:", emailText);

              // Extract RFP ID safely (supports Gmail '> RFP ID')
              const rfpIdMatch = emailText.match(/RFP ID[:>\s]+([a-f0-9]{24})/i);
              const rfpId = rfpIdMatch ? rfpIdMatch[1] : null;

              // doesn;t save incomplete proposals
              if (!rfpId) {
                console.log("Could not extract RFP ID from vendor email");
                return;
              }

              try {
                //parse vendor's reply using AI into structured JSON
                const structured = await parseVendorEmail(emailText);

                // try matching vendor by email
                const vendor = await Vendor.findOne({
                  email: { $regex: new RegExp(`^${from}$`, "i") }
                });

                await Proposal.create({
                  rfpId,
                  vendorId: vendor ? vendor._id : null,
                  vendorName: vendor ? vendor.name : from,
                  vendorEmail: from,
                  rawEmail: emailText,
                  parsedProposal: structured
                });

                console.log("Saved Proposal:", structured);

              } catch (err) {
                console.log("Error parsing vendor email:", err.message);
              }
            });
          });

          f.once("end", () => {
            console.log("Finished processing vendor email");
            imap.end();
            resolve();
          });
        });
      });
    });

    imap.once("error", reject);
    imap.connect();
  });
};

module.exports = { sendRfpEmail, readVendorEmails };
