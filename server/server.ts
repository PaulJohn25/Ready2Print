import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

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

// Define interface for price object
interface PriceItem {
  id: string;
  price: number;
}

// Send email route
// POST /send-email
// Send email with print job details
app.post(
  "/send-email",
  upload.array("files"),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, prices, totalPrice } = req.body;
      const files = req.files as Express.Multer.File[];

      if (!name || !email || !prices || !totalPrice || !files) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const parsedPrices: PriceItem[] = JSON.parse(prices);

      // Create email content
      const filesDetails = parsedPrices
        .map((price) => `File ID: ${price.id}, Price: ${price.price}`)
        .join("\n");

      const emailBody = `
      Name: ${name}
      Email: ${email}

      Files and Pricing:
      ${filesDetails}

      Total Price: ${totalPrice}.00
      `;

      const attachments = files.map((file) => ({
        filename: file.originalname,
        path: path.resolve(file.path),
      }));

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: "New Print Job Submission",
        text: emailBody,
        attachments,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email", error });
    }
  }
);

app.get("/", (req: Request, res: Response): void => {
  res.send("Server is running...");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
