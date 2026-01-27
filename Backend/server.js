import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

import authrouter from "./routes/authRoutes.js";
import courseRoute from "./routes/courseRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import { connection } from "./database/db.js";

const app = express()

// Apply middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/auth", authrouter)
app.use('/api/course', courseRoute);
app.use('/api/booking', bookingRoute);

// Connect to database
connection();

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})