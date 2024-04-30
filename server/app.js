const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Email sending route
app.post('/send-email', upload.single('attachment'), async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text,
    attachments: req.file ? [{ filename: req.file.originalname, path: req.file.path }] : [] // Attachment
    
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.json({error});
    } else {
      console.log('Email sent: ' + info.response);
      res.json({message:'Email sent'});
      
    }
  });
});

  
  app.get('/',(req,res) => {
    res.send('Backend is running')
  })

  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
