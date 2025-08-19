const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
// Serve static files from the parent directory (where contact.html is located)
app.use(express.static(path.join(__dirname, '..')));
app.use(express.urlencoded({ extended: true }));

const port = 5000;

app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'contact.html'));
})

app.get('/contact.html', (req, res) =>{
  res.sendFile(path.join(__dirname, '..', 'contact.html'));
})

mongoose.connect('mongodb+srv://nayan:nayan04@cluster0.lre5h1q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
  console.log('MongoDB is connected');
})

const Schema= mongoose.Schema;

const dataschema= new Schema({
  name: String,
  number: String,
  email: String,
  message: String,
})

const Data = mongoose.model('data', dataschema);

app.post('/submit', async (req, res)=>{
  const {name, number, email, message}= req.body;
  const newData= new Data({
    name,
    number,
    email,message,
  });
  try {
    await newData.save();
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data' });
  }
})

app.listen(port,()=>{
  console.log(`Server is running at port ${port}`)
})