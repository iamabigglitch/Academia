import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Load environment variables FIRST
dotenv.config();

import authrouter from "./routes/authRoutes.js";
import { connection } from "./database/db.js";
// import courseRoute from "./routes/courseRoute.js";
// import bookingRoute from "./routes/bookingRoute.js";

const app = express()

// Apply middleware ONCE
app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Routes
app.use("/auth", authrouter)
// app.use('/api/course', courseRoute);
// app.use('/api/booking', bookingRoute);

// Static folder for uploads
// app.use('/uploads', express.static('uploads'));

// Connect to database
connection();

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})