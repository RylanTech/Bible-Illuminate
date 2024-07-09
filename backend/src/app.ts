import express from 'express';
import morgan from 'morgan';
const app = express();
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config'
import bibleRoutes from './routes/bibleRoutes'
import axios from 'axios';
import aiRoutes from './routes/aiRoutes'


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'))

// incoming requests
const cors = require('cors');
app.use(cors());



// Your API routes and other middleware
// Example route
app.get('/books/:bookId/chapters/:chapterId/:verseId', (req, res) => {
  // Handle your API logic here
  // Replace with your actual API logic
  res.send('API response');
});

app.use("/api/bible", bibleRoutes)
app.use("/api/gemini", aiRoutes)

app.use(( req, res, next) => {
  res.status(404).send("error");
})

// let googleAPIkey = process.env.GOOGLE_API_KEY
// let genAI = new GoogleGenerativeAI(googleAPIkey)

// async function run() {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
//   let prompt = "What are the key differences between the KJV and NIV version of Genesis (37-50). Only give me the overall differences"

//   const result = await model.generateContent(prompt)
//   const response = await result.response
//   const text = response.text()
//   console.log(text)
// }

// run()

// Syncing DB
// db.sync({ alter:false }).then(() => {
//   console.info("Connected to the database!")
// });

app.listen(3001);