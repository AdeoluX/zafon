import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const readHTMLFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
};

export const sendEmail = async (
 {to, subject, templateName, replacements} :{to: string,
  subject: string,
  templateName: string,
  replacements: Record<string, any>}
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // you can use any email service
    auth: {
      user: 'd1headphones@gmail.com',
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const templatePath = path.join(__dirname, `../templates/${templateName}.hbs`);
  const html = await readHTMLFile(templatePath);

  const template = handlebars.compile(html);
  const htmlToSend = template(replacements);

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    html: htmlToSend,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};
