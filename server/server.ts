import express, { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";
import multer from "multer";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid"; // To generate unique file names

dotenv.config();

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT || "", "base64").toString(
    "utf-8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();
const firestore = admin.firestore();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS || "http://localhost:5000";

// Configure multer to use memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
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

transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying email configuration:", error);
  } else {
    console.log("Email configuration is correct");
  }
});

// Define interface for file object
interface FileDetails {
  id: string;
  fileName: string;
  price: number;
}

// Send email route
app.post(
  "/send-email",
  upload.array("uploadedFiles"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Request body:", req.body);
      const { name, email, files, totalPrice } = req.body;
      const uploadedFiles = req.files as Express.Multer.File[];

      // Validate required fields
      if (!name || !email || !files || !totalPrice) {
        res.status(400).json({
          message: "Missing required fields",
          received: { name, email, files, totalPrice },
        });
        return;
      }

      if (!uploadedFiles || uploadedFiles.length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      // Parse prices with error handling
      let pdfDetails: FileDetails[];
      try {
        pdfDetails = JSON.parse(files);
      } catch (error) {
        res.status(400).json({ message: "Invalid prices format" });
        return;
      }

      const uploadFileUrls: string[] = [];

      for (const file of uploadedFiles) {
        const fileName = `${uuidv4()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        await fileUpload.save(file.buffer, {
          contentType: file.mimetype,
          public: true,
        });

        const fileUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;
        uploadFileUrls.push(fileUrl);
      }

      // Save print job details in Firestore
      const docRef = await firestore.collection("printJobs").add({
        name,
        email,
        files: pdfDetails,
        uploadFileUrls,
        totalPrice,
        timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create email content
      const filesDetails = pdfDetails
        .map(
          (file) =>
            `File ID: ${file.id}, File Name: ${file.fileName} Price: ₱${file.price}`
        )
        .join("\n");

      const emailBody = `
      New Print Job Submission
      
      Customer Details:
      Name: ${name}
      Email: ${email}

      Files and Pricing
      ${filesDetails}

      Total Price: ₱${totalPrice}.00

      Files uploaded: ${uploadFileUrls.join(", ")}
      `;

      // Create attachments using buffer instead of file path
      // const attachments = uploadedFiles.map((file) => ({
      //   filename: file.originalname,
      //   content: file.buffer, // Use buffer instead of file path
      // }));

      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: "New Print Job Submission",
        text: emailBody,
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

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Server is running..." });
});

const PORT = process.env.PORT || 5000; // For local development
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Email user configured: ${!!process.env.EMAIL_USER}`);
});

export default app;
