import axios from "axios"
import { RequestHandler } from "express"


export const getVerse: RequestHandler = async (req, res, next) => {
    //https://bible-go-api.rkeplin.com/v1/books/${book}/chapters/${chapter}/${verse}?translation=${translation}
    try {
        let { book, chapter, verse, translation } = req.body
        let verseUrl = `https://bible-go-api.rkeplin.com/v1/books/${book}/chapters/${chapter}/${verse}?translation=${translation}`
        let bibleData: any = await axios.get(verseUrl)
        if (bibleData) {
            return res.status(200).send(bibleData.data)
        } else {
            return res.status(400).send()
        }
    } catch {
        res.status(500).send()
    }
}


export const getVerses: RequestHandler = async (req, res, next) => {
    try {
        const { book, chapter, verseArr, translation } = req.body;
        const verseUrl = `https://bible-go-api.rkeplin.com/v1/books/${book}/chapters/${chapter}/`;
        console.log(verseArr)
        const bibleData = await Promise.all(
            verseArr.map(async (verse: string) => {
                const response = await axios.get(`${verseUrl}${verse}?translation=${translation}`);
                return response.data;
            })
        );
        return res.status(200).send(bibleData);
    } catch (error) {
        console.error(error);
        return res.status(500).send();
    }
};