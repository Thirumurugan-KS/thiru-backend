const nodemailer =  require("nodemailer");

exports.mailSend = async(value)=>{

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "4e6b33604b49b8",
          pass: "5c664b2b563ce1"
        }
      });

     return await transport.sendMail({
        from: value.fromMail, // sender address
        to: value.toMail, // list of receivers
        subject: value.subject, // Subject line
        text: value.text, // plain text body
        html: value.html, // html body
      });
}