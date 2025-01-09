import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import archiver from "archiver";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Configure multer with error handling and size limits
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10, // Maximum 10 files
  },
}).array("uploadedFiles");

// Wrapper for multer error handling
const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      return res.status(500).json({
        message: "Unknown error",
        error: err.message,
      });
    }
    next();
  });
};

// Enhanced error handling for email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 5,
  pool: true,
});

// Email route with better error handling
app.post(
  "/send-email",
  uploadMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, totalPrice } = req.body;
      const uploadedFiles = req.files as Express.Multer.File[];

      // Validate required fields
      if (!name || !email || !uploadedFiles || uploadedFiles.length === 0) {
        res.status(400).json({
          message: "Missing required fields",
          received: {
            name,
            email,
            totalPrice,
            filesCount: uploadedFiles?.length || 0,
          },
        });
        return;
      }

      const zipFileName = `${uuidv4()}.zip`;
      const zipFilePath = path.join(__dirname, zipFileName);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      // Promise wrapper for zip creation
      await new Promise((resolve, reject) => {
        output.on("close", resolve);
        archive.on("error", reject);
        archive.pipe(output);

        uploadedFiles.forEach((file) => {
          archive.append(file.buffer, { name: file.originalname });
        });

        archive.finalize();
      });

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Uploaded Files",
        text: `Hello ${name},\n\nHere are your files in a zip archive. Total Price: ₱${totalPrice}.00`,
        attachments: [
          {
            filename: zipFileName,
            path: zipFilePath,
          },
        ],
      });

      // Cleanup
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
