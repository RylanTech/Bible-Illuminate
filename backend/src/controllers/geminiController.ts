import { GoogleGenerativeAI } from "@google/generative-ai";
import { RequestHandler } from "express"

let googleAPIkey: string = process.env.GOOGLE_API_KEY || ""; // Empty string as default
let genAI = new GoogleGenerativeAI(googleAPIkey)

export const compareOne: RequestHandler = async (req, res, next) => {
    try {
        let translationOne: string = req.params.translationOne
        let translationTwo: string = req.params.translationTwo
        let book: string = req.params.book
        let chapter: string = req.params.chapter
        let verse: string = req.params.verse

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        let prompt = `What are the differences in the meaning between the ${translationOne} and ${translationTwo} version of ${book} chapter ${chapter} verse ${verse} in the christian Bible. 
        Feel free to add fun facts or where a verse has been cross-referenced. Do not quote the mentioned verses. `
        
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        console.log(text)
        res.status(200).send(text)
    } catch {
        res.status(500).send()
    }
}

export const compareMultiple: RequestHandler = async (req, res, next) => {
    // try {
        let translationOne: string = req.params.translationOne
        let translationTwo: string = req.params.translationTwo
        let book: string = req.params.book
        let chapter: string = req.params.chapter
        let verseOne: string = req.params.verseOne
        let verseTwo: string = req.params.verseTwo

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptOne = `What are the differences in the meaning between the ${translationOne} and ${translationTwo} version of ${book} chapter ${chapter} verses ${verseOne} through ${verseTwo} in the christian Bible.
        Please do not quote the verses`
        const promptTwo = `Could you give me an interesting fact about these verses?`;
        const promptThree = `If you can find any, could you give me a cross-reference of this scripture in the bible? If there aren't any obvious ones, reply with "no obvious cross-references"`;


        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500,
            }
        })

        const firstContact = await chat.sendMessage(promptOne);
        const secondContact = await chat.sendMessage(promptTwo);
        const thirdContact = await chat.sendMessage(promptThree)

        const responseOne = await firstContact.response
        const responseTwo = await secondContact.response
        const responseThree = await thirdContact.response

        const textOne = responseOne.text()
        const textTwo = responseTwo.text()
        const textThree = responseThree.text()
        
        const fullResponse = {
            main: textOne,
            funFact: textTwo,
            crossRef: textThree
        }

        res.status(200).send(fullResponse)
    // } catch {
    //     res.status(500).send()
    // }
}

