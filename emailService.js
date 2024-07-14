const nodemailer = require('nodemailer');


module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for all other ports
    auth: {
      user: "gamingsamarth@gmail.com",
      pass: "ltpu aktw lqjb kfqo",
    },
  });
  




module.exports.sendMail = async (transport,mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log("mail is sent")
    } catch (error) {
        console.error(error);
    }
}


// sendMail(transporter,mailOptions);



// const mailOptions= {
//     // send mail with defined transport object
//       from:{
//         name: "Samarth",
//         address: "gamingsamarth@gmail.com"
//       }, // sender address
//       to: [""], // list of receivers
//       subject: "Book borrowed", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     };