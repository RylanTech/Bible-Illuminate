import axios from "axios"
import { RequestHandler } from "express"


export const getVerse: RequestHandler = async (req, res, next) => {

    try {
        let verseUrl = req.body.requestUrl
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