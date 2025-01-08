import express, { Request, Response } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import archiver from "archiver";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import { v4 as uuidv4 } from "uuid"; // To generate unique file names

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS || "http://localhost:5000";

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

console.log(allowedOrigins);

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow custom headers
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

app.post(
  "/send-email",
  upload.array("uploadedFiles"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Request body:", req.body);
      const { name, email, totalPrice } = req.body;
      const uploadedFiles = req.files as Express.Multer.File[];

      // Validate required fields
      if (!name || !email || !uploadedFiles || uploadedFiles.length === 0) {
        res.status(400).json({
          message: "Missing required fields",
          received: { name, email, totalPrice },
        });
        return;
      }

      const zipFileName = `${uuidv4()}.zip`;
      const zipFilePath = path.join(__dirname, zipFileName);

      // Create a zip archive
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        console.log(
          `Zip file created: ${zipFilePath} (${archive.pointer()} bytes)`
        );
      });

      archive.on("error", (err) => {
        throw err;
      });

      archive.pipe(output);

      // Append files to the zip
      uploadedFiles.forEach((file) => {
        archive.append(file.buffer, { name: file.originalname });
      });

      await archive.finalize();

      // Send the email with the zip file as an attachment
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Uploaded Files",
        text: `Hello ${name},

Here are your files in a zip archive. Total Price: ₱${totalPrice}.00`,
        attachments: [
          {
            filename: zipFileName,
            path: zipFilePath, // Attach the zip file
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      // Clean up the zip file after sending
      fs.unlinkSync(zipFilePath);

      res
        .status(200)
        .json({ message: "Email sent successfully with zip file" });
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({
        message: "Failed to process and send email",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Server is running..." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
