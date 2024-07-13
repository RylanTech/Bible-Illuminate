import axios from "axios";
import { createContext } from "react";

export const GeminiContext = createContext()

export const GeminiProvider = (props) => {

    const baseUrl = 'http://192.168.1.17:3001/api/gemini/'

    function compareOneVerse(translationOne, translationTwo, book, chapter, verse) {

        return axios.get(baseUrl + `compare-one/${translationOne}/${translationTwo}/${book}/${chapter}/${verse}`)
            .then(response => {
                return new Promise(resolve => resolve(response.data));
            }
            );
    }

    function compareManyVerses(translationOne, translationTwo, book, chapter, verseOne, verseTwo) {

        return axios.get(baseUrl + `compare-many/${translationOne}/${translationTwo}/${book}/${chapter}/${verseOne}/${verseTwo}`)
            .then(response => {
                return new Promise(resolve => resolve(response.data));
            }
            );
    }

    return (
        <GeminiContext.Provider
            value={{
                compareOneVerse,
                compareManyVerses
            }}
        >
            {props.children}
        </GeminiContext.Provider>
    )
}