const nodemailer = require("nodemailer");

const sendEmail = (message) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "onthemovecars811@gmail.com",
        pass: "ezcrrgbmavfzxjpt",
      },
    });

    transporter.sendMail(message, function (err, info) {
      if (err) {
        console.log("Error occurred while sending email:", err);
        reject(err);
      } else {
        console.log("Email sent:", info);
        resolve(true);
      }
    });
  });
};

const ContactUsPage = function (user, email, info) {
  const message = {
    from: "onthemovecars811@gmail.com",
    // to: toUser.email // in production uncomment this
    to: "onthemovecars811@gmail.com",
    subject: `You have a query from ${user}`,
    html: `
        <h3> Hello admin  </h3>
        <p>Name ${user}</p>
        <p>email ${email}</p>
   
        <p>message ${info}</p>
      
        <p>Please contact this person asap </p>
      `,
  };

  return sendEmail(message);



};

  
const CarBooked = function (user, email, number, info) {
    const message = {
      from: "onthemovecars811@gmail.com",
      // to: toUser.email // in production uncomment this
      to: "ak@gmail.com",
      subject: `You have a query from ${user}`,
      html: `
          <h3> Hello admin  </h3>
          <p>Name ${user}</p>
          <p>email ${email}</p>
          <p>having contact number ${number}</p>
          <p>message ${info}</p>
        
          <p>Please contact this person asap </p>
        `,
    };
  
    return sendEmail(message);
}


module.exports={ContactUsPage};
