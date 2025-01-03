import express, { Request, Response } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
// import path from "path";
// import fs from "fs";

require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.sendMail(
  {
    from: process.env.EMAIL_USER,
    to: "johnpaulnidua@gmail.com",
    subject: "Test Email",
    text: "This is a test email",
  },
  (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

export default app;
