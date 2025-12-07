
const Rfp = require("../models/Rfp");
const Vendor = require("../models/Vendor");
const { sendRfpEmail } = require("../services/emailService");
const { parseRfpText } = require("../services/aiService");

// Create RFP for RFP page
const createRfp = async (req, res) => {
  try {
    const { text } = req.body;
    console.log("Created RFP:", text);

    const structured = await parseRfpText(text);
    console.log("Structured RFP Data:", structured);

    const rfp = await Rfp.create({
      title: "RFP " + Date.now(),
      rawInput: text,
      structuredData: structured,
    });

    res.json(rfp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send RFP to Vendors  

const sendRfpToVendors = async (req, res) => {
  try {
    const { rfpId, vendorIds } = req.body;

    console.log("Sending RFP ID:", rfpId, "to Vendors:", vendorIds);

    const rfp = await Rfp.findById(rfpId);
    console.log("RFP found:", rfp);

    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    console.log("Vendors found:", vendors);

    //for each vendor in vendors list I am sending the email with this template to vendor
    for (let vendor of vendors) {

      const emailBody = `
RFP ID: ${rfp._id}

Hello ${vendor.name},

Please see the RFP details below:

${JSON.stringify(rfp.structuredData, null, 2)}

Please reply to this email with:

- Price per unit
- Total cost
- Delivery days
- Warranty
- Additional notes

Reply directly to this email.

Thanks,
Procurement System
`;

      await sendRfpEmail(
        vendor.email,
        "New RFP Invitation",
        emailBody
      );

      console.log(`Sent RFP email to vendor: ${vendor.email}`);
    }

    // Save vendors to whom RFP was sent under the vendorsSent array column of the database
    rfp.vendorsSent = [...new Set([...(rfp.vendorsSent || []), ...vendorIds])];
    await rfp.save();

    res.json({ message: "Emails Sent Successfully" });

  } catch (err) {
    console.error("Error sending RFP emails:", err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createRfp,
  sendRfpToVendors,
};
