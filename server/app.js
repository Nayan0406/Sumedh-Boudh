import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import blogRoute from './routes/blogRoute.js';
import registerRoute from './routes/registerRoute.js';
import cors from 'cors';
import loginRoute from './routes/loginRoute.js';
import productRoute from './routes/productRoute.js';
import contactRoute from './routes/contactRoute.js';

dotenv.config();

// const corsOptions = {
//   origin: ["http://127.0.0.1:5500/"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// };

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5000",
    "https://sumedh-boudh-admin-panel.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use('/blog', blogRoute);

app.use('/register', registerRoute);

app.use('/login', loginRoute);

// Static uploads route no longer needed - using Cloudinary
app.use('/product', productRoute);
app.use('/contact', contactRoute);

app.get('/', (req, res) =>{
  res.json({ message: 'TARS API Server is running!' });
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('MongoDB is connected');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Export the app for Vercel
export default app;

// Only listen when not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
}