import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const allowedOrigins = ["https://ready2-print.vercel.app"];

// Configure multer to use memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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

// Define interface for price object
interface FileDetails {
  id: string;
  fileName: string;
  price: number;
}

// Send email route
app.post(
  "/send-email",
  upload.array("files"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Request body:", req.body);
      const { name, email, prices, totalPrice } = req.body;
      const files = req.files as Express.Multer.File[];

      // Validate required fields
      if (!name || !email || !prices || !totalPrice) {
        res.status(400).json({
          message: "Missing required fields",
          received: { name, email, hasPrices: !!prices, totalPrice },
        });
        return;
      }

      if (!files || files.length === 0) {
        res.status(400).json({ message: "No files uploaded" });
        return;
      }

      // Parse prices with error handling
      let pdfDetails: FileDetails[];
      try {
        pdfDetails = JSON.parse(prices);
      } catch (error) {
        res.status(400).json({ message: "Invalid prices format" });
        return;
      }

      // Create email content
      const filesDetails = pdfDetails
        .map(
          (price) =>
            `File ID: ${price.id}, File Name: ${price.fileName} Price: ₱${price.price}\n`
        )
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

      // Create attachments using buffer instead of file path
      const attachments = files.map((file) => ({
        filename: file.originalname,
        content: file.buffer, // Use buffer instead of file path
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

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Server is running..." });
});

const PORT = process.env.PORT || 5000; // For local development
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Email user configured: ${!!process.env.EMAIL_USER}`);
});

export default app;
