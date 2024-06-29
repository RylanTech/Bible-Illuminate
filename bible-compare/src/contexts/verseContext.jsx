import axios from "axios";
import { createContext } from "react";

export const VerseContext = createContext()

export const VerseProvider = (props) => {

    const baseUrl = 'http://localhost:3001/api/'

    function getVerse(translation, book, chapter, verse) {

        return axios.post(baseUrl + "bible/get-verse", {
            requestUrl: `https://bible-go-api.rkeplin.com/v1/books/${book}/chapters/${chapter}/${verse}?translation=${translation}`
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
            }}
        >
            {props.children}
        </VerseContext.Provider>
    )
}