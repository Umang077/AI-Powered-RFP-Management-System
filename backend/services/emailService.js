const { smtpTransport, imapConfig } = require("../config/email.js");
const Imap = require("imap");
// const { smtpTransport, imapConfig } = require("../config/email.js");
// const Imap = require("imap");
const { simpleParser } = require("mailparser");
const Proposal = require("../models/Proposal");
const Vendor = require("../models/Vendor");
const { parseVendorEmail } = require("../services/aiService");
const sendRfpEmail = (to, subject, body) => {
  return smtpTransport.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body
  });
};

// const readVendorEmails = () => {
//   const imap = new Imap(imapConfig);

//   return new Promise((resolve, reject) => {
//     imap.once("ready", () => {
//       imap.openBox("INBOX", false, () => {
//         imap.search(["UNSEEN"], (err, results) => {
//           if (!results.length) return resolve([]);

//           const emails = [];

//           const f = imap.fetch(results, { bodies: "" });

//           f.on("message", (msg) => {
//             msg.on("body", (stream) => {
//               let buffer = "";
//               stream.on("data", (chunk) => (buffer += chunk.toString("utf8")));
//               stream.on("end", () => emails.push(buffer));
//             });
//           });

//           f.once("end", () => {
//             resolve(emails);
//             imap.end();
//           });
//         });
//       });
//     });

//     imap.once("error", reject);
//     imap.connect();
//   });
// };
const readVendorEmails = () => {
  const imap = new Imap(imapConfig);

  return new Promise((resolve, reject) => {
    
    imap.once("ready", () => {
      console.log("📬 IMAP Ready - Connected to Gmail");
      imap.openBox("INBOX", false, () => {
        imap.search(["UNSEEN"], (err, results) => {
          if (!results || results.length === 0) {
            console.log("📭 No new vendor emails");
            return resolve([]);
          }

          console.log("📧 Total UNSEEN emails:", results.length);

          // Pick only the latest unread email
          const latestEmailUid = results[results.length - 1];
          console.log("📨 Processing only latest email UID:", latestEmailUid);

          const f = imap.fetch(latestEmailUid, { bodies: "" });

          f.on("message", (msg) => {
            msg.on("body", async (stream) => {
              console.log("📨 Reading new vendor email...");

              const parsed = await simpleParser(stream);
              console.log("📜 Vendor Email Parsed Text:", parsed.text);
              console.log("📧 From:", parsed.from.text);
              const emailText = parsed.text?.trim();
              const from = parsed.from.text;

              console.log("📨 NEW EMAIL FROM:", from);
              console.log("📜 Email Text:", emailText);

              try {
                const structured = await parseVendorEmail(emailText);
                const rfpIdMatch = emailText.match(/RFP ID:\s*(\S+)/);
                const rfpId = rfpIdMatch ? rfpIdMatch[1] : null;
                const vendor = await Vendor.findOne({ email: { $regex: new RegExp(`^${from}$`, "i") } });


                await Proposal.create({
                  rfpId,
                  vendorId: vendor ? vendor._id : null,
                  vendorName: vendor ? vendor.name : from,
                  vendorEmail: from,
                  rawEmail: emailText,
                  parsedProposal: structured
                });

                console.log("💾 Saved Proposal:", structured);
              } catch (err) {
                console.log("❌ Error parsing vendor email:", err.message);
              }
            });
          });

          f.once("end", () => {
            console.log("✔ Finished processing vendor emails");
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
