import express from 'express';
import dotenv from 'dotenv';
import DBConnect from './config/db.js';
import slotRouter from "./routes/slot.routes.js"
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

DBConnect();

app.get("/", (req, res) => {
    res.json({msg: "You are on the home route"})
})

app.use("/", slotRouter)


app.listen(process.env.PORT || 5000, (req, res) => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
})