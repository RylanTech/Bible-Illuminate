import { GoogleGenerativeAI } from "@google/generative-ai";
import { RequestHandler } from "express"

let googleAPIkey: string = process.env.GOOGLE_API_KEY || ""; // Empty string as default
let genAI = new GoogleGenerativeAI(googleAPIkey)

export const compareTwoTranslationsOneVerse: RequestHandler = async (req, res, next) => {
    try {
        let translationOne: string = req.params.translationOne
        let translationTwo: string = req.params.translationTwo
        let book: string = req.params.book
        let chapter: string = req.params.chapter
        let verse: string = req.params.verse

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptOne = `In short, what are the differences in the meaning between the ${translationOne} and ${translationTwo} versions of ${book} chapter ${chapter} verses ${verse} in the christian Bible.
        Please do not quote the verses`
        const promptTwo = `In short, could you give me an interesting fact about this verse?`;
        const promptThree = `In short, if you can find any, could you give me a cross-reference of this scripture in the bible? If there aren't any obvious ones, reply with "no obvious cross-references"`;
        const promptFour = `In short, could you give me some historical information such as the writer, when it was written, why it was written and to whom it was written to.`
        

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500,
            }
        })

        const firstContact = await chat.sendMessage(promptOne);
        const secondContact = await chat.sendMessage(promptTwo);
        const thirdContact = await chat.sendMessage(promptThree);
        const fourthContact = await chat.sendMessage(promptFour);

        const responseOne = await firstContact.response
        const responseTwo = await secondContact.response
        const responseThree = await thirdContact.response
        const responseFour = await fourthContact.response

        const textOne = responseOne.text()
        const textTwo = responseTwo.text()
        const textThree = responseThree.text()
        const textFour = responseFour.text()

        const fullResponse = {
            main: textOne,
            funFact: textTwo,
            crossRef: textThree,
            history: textFour
        }

        res.status(200).send(fullResponse)
    } catch {
        res.status(500).send()
    }
}

export const compareTwoTranslationsMultipleVerses: RequestHandler = async (req, res, next) => {
    try {
        let translationOne: string = req.params.translationOne
        let translationTwo: string = req.params.translationTwo
        let book: string = req.params.book
        let chapter: string = req.params.chapter
        let verseOne: string = req.params.verseOne
        let verseTwo: string = req.params.verseTwo

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptOne = `In short, what are the differences in the meaning between the ${translationOne} and ${translationTwo} versions of ${book} chapter ${chapter} verses ${verseOne} through ${verseTwo} in the christian Bible.
        Please do not quote the verses`
        const promptTwo = `In short, Could you give me an interesting fact about these verses?`;
        const promptThree = `In short, if you can find any, could you give me a cross-reference of this scripture in the bible? If there aren't any obvious ones, reply with "no obvious cross-references"`;
        const promptFour = `In short, could you give me some historical information such as the writer, when it was written, why it was written and to whom it was written to.`

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500,
            }
        })

        const firstContact = await chat.sendMessage(promptOne);
        const secondContact = await chat.sendMessage(promptTwo);
        const thirdContact = await chat.sendMessage(promptThree);
        const fourthContact = await chat.sendMessage(promptFour);

        const responseOne = await firstContact.response
        const responseTwo = await secondContact.response
        const responseThree = await thirdContact.response
        const responseFour = await fourthContact.response

        const textOne = responseOne.text()
        const textTwo = responseTwo.text()
        const textThree = responseThree.text()
        const textFour = responseFour.text()

        const fullResponse = {
            main: textOne,
            funFact: textTwo,
            crossRef: textThree,
            history: textFour
        }

        res.status(200).send(fullResponse)
    } catch {
        res.status(500).send()
    }
}

export const compareOneTranslationOneVerse: RequestHandler = async (req, res, next) => {
    try {
        let translationOne: string = req.params.translationOne
        let book: string = req.params.book
        let chapter: string = req.params.chapter
        let verse: string = req.params.verse

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptOne = `In short, could you give me a recap of what ${book} chapter ${chapter} verse ${verse} ${translationOne} is talking about?`
        const promptTwo = `In short, could you give me an interesting fact about this verse?`;
        const promptThree = `In short, if you can find any, could you give me a cross-reference of this scripture in the bible? If there aren't any obvious ones, reply with "no obvious cross-references"`;
        const promptFour = `In short, could you give me some historical information such as the writer, when it was written, why it was written and to whom it was written to.`
        

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500,
            }
        })

        const firstContact = await chat.sendMessage(promptOne);
        const secondContact = await chat.sendMessage(promptTwo);
        const thirdContact = await chat.sendMessage(promptThree);
        const fourthContact = await chat.sendMessage(promptFour);

        const responseOne = await firstContact.response
        const responseTwo = await secondContact.response
        const responseThree = await thirdContact.response
        const responseFour = await fourthContact.response

        const textOne = responseOne.text()
        const textTwo = responseTwo.text()
        const textThree = responseThree.text()
        const textFour = responseFour.text()

        const fullResponse = {
            main: textOne,
            funFact: textTwo,
            crossRef: textThree,
            history: textFour
        }

        res.status(200).send(fullResponse)
    } catch {
        res.status(500).send()
    }
}

export const compareOneTranslationManyVerse: RequestHandler = async (req, res, next) => {
    try {
        let translationOne: string = req.params.translationOne
        let book: string = req.params.book
        let chapter: string = req.params.chapter
        let verse: string = req.params.verseOne
        let verseTwo: string = req.params.verseTwo

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const promptOne = `In short, could you give me a recap of what ${book} chapter ${chapter} verse ${verse} through ${verseTwo} ${translationOne} is talking about?`
        const promptTwo = `In short, could you give me an interesting fact about this verse?`;
        const promptThree = `In short, if ylet verseTwo: string = req.params.verseTwoou can find any, could you give me a cross-reference of this scripture in the bible? If there aren't any obvious ones, reply with "no obvious cross-references"`;
        const promptFour = `In short, could you give me some historical information such as the writer, when it was written, why it was written and to whom it was written to.`
        

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 500,
            }
        })

        const firstContact = await chat.sendMessage(promptOne);
        const secondContact = await chat.sendMessage(promptTwo);
        const thirdContact = await chat.sendMessage(promptThree);
        const fourthContact = await chat.sendMessage(promptFour);

        const responseOne = await firstContact.response
        const responseTwo = await secondContact.response
        const responseThree = await thirdContact.response
        const responseFour = await fourthContact.response

        const textOne = responseOne.text()
        const textTwo = responseTwo.text()
        const textThree = responseThree.text()
        const textFour = responseFour.text()

        const fullResponse = {
            main: textOne,
            funFact: textTwo,
            crossRef: textThree,
            history: textFour
        }

        res.status(200).send(fullResponse)
    } catch {
        res.status(500).send()
    }
}