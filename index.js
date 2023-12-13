import express from "express";
import mongoose from "mongoose";
import router from "./routes.js"





mongoose.connect("mongodb://127.0.0.1:27017/manga", )

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use('/manga', router)



app.listen(8000);



