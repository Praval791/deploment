const express = require("express");
const nodemailer = require("nodemailer");
const { createToken, getPayload } = require("./tokens");
const {
  addEmailToToken,
  removeEmail,
  emailPresent,
} = require("./databaseMocks");
const { acceptedScript } = require("./scripts/approved");
const { rejectionScript } = require("./scripts/rejection");
const {
  port,
  invalidToken,
  tokenExpired,
  requestApproved,
  requestRejected,
  recipientEmail,
  adminEmail,
  adminEmailPassword,
} = require("./constants");

const app = express();

const apiDomain = `http://localhost:${port}`;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: false,
  auth: {
    user: adminEmail, // your email address
    pass: adminEmailPassword, // your password
  },
});

const token = createToken(recipientEmail);

addEmailToToken(recipientEmail, token);
// Email options
let mailDetails = {
  from: adminEmail,
  to: recipientEmail,
  subject: "Test mail",
  html: `
    <p>Do you want to accept the deployment or not?</p>
    <p>
      <a href="${apiDomain}/accept/${token}">Accept it</a><br>
      <a href="${apiDomain}/reject/${token}">Reject it</a>
    </p>
        `,
};

transporter.sendMail(mailDetails, (error, info) => {
  if (error) console.log("Error: Unable to send email\n", error);
  else console.log("Email sent successfully" + info.response);
});

app.use(express.json());

// // API endpoint to send an email
// app.post("/send-email", (req, res) => {
//   // Get data from request body
//   const to = req.body.to || recipientEmail;
//   const token = createToken(to);

//   addEmailToToken(to, token);
//   // Email options
//   let mailDetails = {
//     from: `"Fred Foo 👍" <noreply.snappychats@gmail.com>`,
//     to: to,
//     subject: "Test mail",
//     html: `
//     <p>Do you want to accept the deployment or not?</p>
//     <p>
//       <a href="${apiDomain}/accept/${token}">Accept it</a><br>
//       <a href="${apiDomain}/reject/${token}">Reject it</a>
//     </p>
//         `,
//   };

//   transporter.sendMail(mailDetails, (error, info) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send("Error: Unable to send email");
//     } else {
//       console.log("Email sent: " + info.response);
//       res.status(200).send("Email sent successfully");
//     }
//   });
// });

app.get("/accept/:token", (req, res) => {
  const { token } = req.params;
  const {
    payload: { email },
    error,
  } = getPayload(token);

  if (!email) {
    if (error === "jwt expired")
      return res.status(404).sendFile(tokenExpired, { root: __dirname });
    else return res.status(404).sendFile(invalidToken, { root: __dirname });
  }

  if (!emailPresent(email))
    return res.status(404).sendFile(tokenExpired, { root: __dirname });
  removeEmail(email);

  acceptedScript(); // run when email is accepted

  res.status(200).sendFile(requestApproved, { root: __dirname });

  // let mailDetails = {
  //   from: `"Fred Foo 👍" <noreply.snappychats@gmail.com>`,
  //   to: recipientEmail,
  //   subject: "Test mail",
  //   html: `<img fetchpriority="high" decoding="async" width="741" height="441" src="https://blog-images-1.pharmeasy.in/blog/production/wp-content/uploads/2021/08/27183305/Blog-image-size.jpg" class="img-responsive border_r4 postthumbnail_image wp-post-image" alt="" srcset="https://blog-images-1.pharmeasy.in/blog/production/wp-content/uploads/2021/08/27183305/Blog-image-size.jpg 760w, https://blog-images-1.pharmeasy.in/blog/production/wp-content/uploads/2021/08/27183305/Blog-image-size-300x178.jpg 300w" sizes="(max-width: 741px) 100vw, 741px">`,
  // };

  // transporter.sendMail(mailDetails, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //     res.status(500).send("Error: Unable to send email accept");
  //   } else {
  //     console.log("Email sent: " + info.response);
  //     res.status(200).send("Email sent successfully");
  //   }
  // });
});

app.get("/reject/:token", (req, res) => {
  const token = req.params.token;
  const {
    payload: { email },
    error,
  } = getPayload(token);

  if (!email) {
    if (error === "jwt expired")
      return res.status(404).sendFile(tokenExpired, { root: __dirname });
    else return res.status(404).sendFile(invalidToken, { root: __dirname });
  }

  if (!emailPresent(email))
    return res.status(404).sendFile(tokenExpired, { root: __dirname });
  removeEmail(email);

  rejectionScript(); // run when email is rejected

  res.status(200).sendFile(requestRejected, { root: __dirname });

  // let mailDetails = {
  //   from: `"Fred Foo 👍" <noreply.snappychats@gmail.com>`,
  //   to: recipientEmail,
  //   subject: "Test mail",
  //   html: `
  //   <img src="https://memes.co.in/video/upload/photos/2022/10/heWKZHtSFbnqTZBwvm53_29_c0c1ec06eb26d5034ae13bee5014be7f_image.jpg" jsaction="VQAsE" class="sFlh5c pT0Scc iPVvYb" style="max-width: 1076px; height: 237px; margin: 83px 0px;" alt="Khatam Bye Bye Tata Goodbye Gaya Meme Video Download" jsname="kn3ccd" aria-hidden="false"></img>`,
  // };

  // transporter.sendMail(mailDetails, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //     res.status(500).send("Error: Unable to send email reject");
  //   } else {
  //     console.log("Email sent: " + info.response);
  //     res.status(200).send("Email sent successfully");
  //   }
  // });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
