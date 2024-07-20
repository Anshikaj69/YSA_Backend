const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle form submission
app.post('/api/email', upload.single('file'), (req, res) => {
  const { name, email, phone, companyName, industry, companySize, additionalInfo, plan, agents, day, date } = req.body;
  const file = req.file;

  // Set up Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact form submission from ${name} <${email}>`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Company Name: ${companyName}
      Industry: ${industry}
      Company Size: ${companySize}
      Additional Info: ${additionalInfo}
      Plan: ${plan}
      Agents: ${agents}
      Day: ${day}
      Date: ${date}
    `
  };

  // Attach file if it exists
  if (file) {
    mailOptions.attachments = [
      {
        filename: file.originalname,
        content: file.buffer
      }
    ];
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }
    console.log('Email sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
