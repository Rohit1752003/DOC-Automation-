const sendEmail = require("../sendEmail");

exports.approveDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate("student");

    document.status = "approved";
    await document.save();

    await sendEmail(
      document.student.email,
      "Document Approved ✅",
      `
      Dear ${document.student.name},<br><br>
      Your requested document has been <b>approved</b> successfully.<br>
      You can now download it from the portal.<br><br>
      Regards,<br>
      College Administration
      `
    );

    res.json({ message: "Approved + Email Sent" });

  } catch (error) {
    res.status(500).json(error.message);
  }
};