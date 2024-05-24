import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
const app = express();
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config'

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'))

// incoming requests
const cors = require('cors');
app.use(cors());

app.use(( req, res, next) => {
  res.status(404).send("error");
})

let googleAPIkey = process.env.GOOGLE_API_KEY
let genAI = new GoogleGenerativeAI(googleAPIkey)

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
  let prompt = "give me 3 questions about the story of Gideon in the bible in the format of a array of JSON object with the question value being 'question'"
  prompt = "What was the sign that God gave Gideon to prove his calling? Could you qoute a part of the verse"

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()
  console.log(text)
}

run()

// Syncing DB
// db.sync({ alter:false }).then(() => {
//   console.info("Connected to the database!")
// });

app.listen(3001);