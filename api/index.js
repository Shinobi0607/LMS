import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../server/configs/mongodb.js";
import connectCloudinary from "../server/configs/cloudinary.js";
import { clerkWebhooks, stripeWebhooks } from "../server/controllers/webhooks.js";
import educatorRouter from "../server/routes/educatorRoutes.js";
import courseRouter from "../server/routes/courseRoute.js";
import userRouter from "../server/routes/userRoutes.js";

const app = express();
app.use(cors());

// Connect once
await connectDB();
await connectCloudinary();

// Raw routes first
app.post("/clerk", express.raw({ type: "*/*" }), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// JSON parser
app.use(express.json());

// APIs
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/educator", educatorRouter);

// Health check
app.get("/", (req, res) => {
  res.send("LMS Backend Running on Vercel 🚀");
});

// ❌ NO app.listen()
// ✅ Export app
export default app;
