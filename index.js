var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhadriir@gmail.com',
    pass: 'lrqo ujlm zmhy aiyh'
  }
});

var mailOptions = {
  from: 'bhadriir@gmail.com',
  to: 'bhadriir@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});