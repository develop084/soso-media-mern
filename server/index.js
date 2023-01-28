import express from 'express';
import bodyParser from 'body-parser'; 
import mongoose from "mongoose"; 
import cors from 'cors'
import dotenv from 'dotenv'; 
import multer from "multer"; 
import morgan from "morgan"; 
import path from "path"; 
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import {register} from ".controllers/auth.js"


// CONFIG MIDDLEWARE 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
dotenv.config() 

const app = express(); 

app.use(express.json()); 
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended : true})); 
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors()); 
app.use("/assets", express.static(path.join(__dirname,"public/assets"))); 

// File storage

const storage =  multer.diskStorage({
    destination: function(req,file, cb){
        cb(null,'public/assets');
    }, 
    filename: function(req,file,cb){
       cb(null, file.originalName)
    }
});

const upload = multer({storage}); 


// routes  with files
app.post("/auth/register", upload.single("picture"),register)


// routes

app.use("/auth", authRoutes)







const PORT = process.env.MONGO_URI || 8000;

mongoose.connect(process.env.MONGO_URI, 
    {   useNewUrlParser: true,
   
        useUnifiedTopology: true  }
).then(()=> {
    app.listen(PORT, ()=> console.log( `Port Started on ${PORT}`))
}).catch((err)=> console.log(`connection failed ${err}`))


