import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import blogRoute from './routes/blogRoute.js';
import bcrypt from 'bcryptjs';
import registerRoute from './routes/registerRoute.js';
import cors from 'cors';
import loginRoute from './routes/loginRoute.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the parent directory (where contact.html is located)
app.use(express.static(path.join(__dirname, '..')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 5000;

app.use(cors());

app.use('/blog', blogRoute);

app.use('/register', registerRoute);

app.use('/login', loginRoute);

app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'contact.html'));
})

app.get('/contact.html', (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'contact.html'));
})

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('MongoDB is connected');
})

app.listen(port,()=>{
  console.log(`Server is running at port ${port}`)
})