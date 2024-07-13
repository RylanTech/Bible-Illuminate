import axios from "axios";
import { createContext } from "react";

export const VerseContext = createContext()

export const VerseProvider = (props) => {

    const baseUrl = 'http://192.168.1.17:3001/api/'
    // requestUrl: `https://bible-go-api.rkeplin.com/v1/books/${book}/chapters/${chapter}/${verse}?translation=${translation}`

    function getVerse(translation, book, chapter, verse) {

        return axios.post(baseUrl + "bible/get-verse", {
            translation: translation,
            book: book,
            chapter: chapter,
            verse: verse
        })
            .then(response => {
                return new Promise(resolve => resolve(response.data));
            }
            );
    }

    function getVerses(translation, book, chapter, verseArr) {

        return axios.post(baseUrl + "bible/get-verses", {
            translation: translation,
            book: book,
            chapter: chapter,
            verseArr: verseArr
        })
            .then(response => {
                return new Promise(resolve => resolve(response.data));
            }
            );
    }

    return (
        <VerseContext.Provider
            value={{
                getVerse,
                getVerses
            }}
        >
            {props.children}
        </VerseContext.Provider>
    )
}