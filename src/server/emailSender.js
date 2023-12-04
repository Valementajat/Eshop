var nodemailer = require('nodemailer');
const crypto = require('crypto');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'noreplyeshop2@gmail.com',
      pass: 'wins jgvc grfe ozoj'
    }
  });

  module.exports = {
    sendEmail: function(mailOptions) {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
      },

    newUser: function(){

    return crypto.randomBytes(20).toString('hex'); // Generate a random token
    },

    generateVerificationEmail: function(email, token) {
      const verificationLink = `localhost/verify/${encodeURIComponent(email)}/${token}`;
      var mailOptions = {
        from: 'noreplyeshop2@gmail.com',
        to: email,
        subject: 'Verify your email address',
        text: 'Thank you for signing up! Please click on the link below to verify your email address:',
        html: `<p>Thank you for signing up!</p><p>Please click on the link below to verify your email address:</p>
              <a href="${verificationLink}">Verify Email</a>
              <p>If you did not sign up for this service, you can safely ignore this email.</p>`
      };
    
      return mailOptions;
    },
    
    
};