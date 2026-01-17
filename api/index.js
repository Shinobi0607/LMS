import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../server/configs/mongodb.js";
import connectCloudinary from "../server/configs/cloudinary.js";
import { clerkWebhooks, stripeWebhooks } from "../server/controllers/webhooks.js";
import educatorRouter from "../server/routes/educatorRoutes.js";
import courseRouter from "../server/routes/courseRoute.js";
import userRouter from "../server/routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
app.use(cors());
app.use(clerkMiddleware());

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

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// ❌ NO app.listen()
// ✅ Export app
export default app;
