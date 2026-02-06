import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"

dotenv.config();

import authrouter from "./routes/authRoutes.js";
import courseRoute from "./routes/courseRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import { connection } from "./database/db.js";

const app = express()

const uploadsDir = path.join(process.cwd(), 'uploads', 'profiles');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads/profiles directory');
}

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/uploads', express.static('uploads'));

app.use("/auth", authrouter) 
app.use('/api/course', courseRoute);
app.use('/api/booking', bookingRoute);

connection();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})