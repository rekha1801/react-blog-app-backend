import nodemailer from "nodemailer";
//import fs from "fs";
//import path from "path";
//import handlebars from "handlebars";

const sendEmail = async (email, subject, message, payload, template) => {
  // 1) create a transporter(a service that will actually send the email, sth like gmail)

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // if you use gmail as service, you need to activate in gmail "less secure app" option. It is not logical to use gmail when there might be more than maybe hundred email sent for resetpassword => means many users. Because then you might be marked as spammer and blocked. It is recommended to use sendGrid. For now we use mailtrap.
  });

  // const source = fs.readFileSync(path.join(__dirname, template), "utf8");
  //const compiledTemplate = handlebars.compile(source);

  // 2) define the email options
  const mailOptions = () => {
    return {
      from: "Rekha <rekha@admin.com>",
      to: email,
      subject: subject,
      text: message,
      // html: compiledTemplate(payload),
    };
  };

  // 3) send the email with nodemailer
  await transporter.sendMail(mailOptions());
  // this returns a promise
};

export default sendEmail;
