import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import courseRoute from "./routes/courseRoute.js";
// import bookingRoute from "./routes/bookingRoute.js";
dotenv.config();

const app = express()
app.use(express.json())
const port="3000"
app.listen(port,()=>{
console.log(`server running in port ${port}`)
})

app.use(cors({
    origin: ['  http://localhost:5173',   'http://localhost:5174' ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/uploads' , express.static('uploads'));

app.use('/api/course', courseRoute);
// app.use('/api/booking', bookingRoute);

