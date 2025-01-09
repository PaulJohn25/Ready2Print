import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import cors from "cors";

interface FileDetails {
  id: string;
  fileName: string;
  price: number;
}

dotenv.config();

const app = express();

// Ensure allowed origins are properly formatted
const allowedOrigins = ["http://localhost:5000"];
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(
    ...process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  );
}

// Configure CORS with proper error handling
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  })
);

// Increase payload size limits
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure multer with error handling and size limits
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify the connection
transporter.verify((error, success) => {
  if (error) {
    console.log("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages!");
  }
});

app.post(
  "/send-email",
  upload.array("uploadedFiles"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, files, totalPrice } = req.body;
      const uploadedFiles = req.files as Express.Multer.File[];

      // Validate required fields
      if (!name || !email || !uploadedFiles || uploadedFiles.length === 0) {
        res.status(400).json({
          message: "Missing required fields",
          received: { name, email, totalPrice },
        });
        return;
      }

      if (!uploadedFiles || uploadedFiles.length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      let pdfDetails: FileDetails[];

      try {
        pdfDetails = JSON.parse(files);
      } catch (error) {
        res.status(400).json({ message: "Invalid prices format" });
        return;
      }

      // Create email content

      const filesDetails = pdfDetails
        .map((file) => {
          `File ID: ${file.id}, File Name: ${file.fileName}, Price: ₱${file.price}`;
        })
        .join("\n");

      const emailBody = `
      New Print Job Submission

      Customer Details:
      Name: ${name}
      Email: ${email}

      Files and Pricing:
      ${filesDetails}

      Total Price: ₱${totalPrice}.00
      `;

      const attachments = uploadedFiles.map((file) => ({
        fileName: file.originalname,
        content: file.buffer,
      }));

      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: "New Print Job Submission",
        text: emailBody,
        attachments,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({
        message: "Failed to send email",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.get("/", (req: Request, res: Response) => {
  console.log("Server is running....");
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});

export default app;
