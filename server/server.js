import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'

const app = express()

// Connect services
await connectDB()
await connectCloudinary()

// Global middlewares
app.use(cors())
app.use(clerkMiddleware())

// Health check
app.get('/', (req, res) => res.send("API Working"))

// 🔥 1️⃣ Multipart routes MUST come first
// Multer needs the raw stream, so no JSON parser here
app.use('/api/educator', educatorRouter)

// 🔥 2️⃣ Clerk webhooks must use RAW body (NOT express.json)
app.post('/clerk', express.raw({ type: '*/*' }), clerkWebhooks)

// 🔥 3️⃣ JSON parser MUST be last
// Only normal JSON APIs should use this
app.use(express.json())

app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({ type: 'application/json'}), stripeWebhooks)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
