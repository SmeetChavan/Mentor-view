import { urlencoded } from "express";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import allRoutes from "./routes/allRoutes.js"
import cors from "cors";

dotenv.config({
    path: "./.env",
});

const app = express();

app.use(express.json());
app.use(urlencoded({extended: true}));

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
}))

app.use("/" , allRoutes);

app.get("/" , (req , res , next) => {
    res.send("Black backend page");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to db"))
.catch((error) => console.log("Error" + error))

app.listen(process.env.PORT , () => console.log("Listening on port " + process.env.PORT));