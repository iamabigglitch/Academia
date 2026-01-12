import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import courseRoute from "./routes/courseRoute";
import bookingRoute from "./routes/bookingRoute";
dotenv.config();

const app = express()
app.use(express.json())
const port="3000"
app.listen(port,()=>{
console.log(`server running in port ${port}`)
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/uploads' , express.static('uploads'));

app.use('/api/course', courseRoute);
app.use('/api/booking', bookingRoute);

