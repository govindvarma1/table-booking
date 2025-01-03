import express from 'express';
import dotenv from 'dotenv';
import DBConnect from './config/db.js';

const app = express();
app.use(express.json());
dotenv.config();

DBConnect();

app.get("/", (req, res) => {
    res.json({msg: "You are on the home route"})
})


app.listen(process.env.PORT || 5000, (req, res) => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
})