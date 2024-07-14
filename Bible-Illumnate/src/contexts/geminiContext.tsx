import axios from "axios";
import React, { createContext, ReactNode } from "react";

interface GeminiContextProps {
    compareOneVerse: (translationOne: string, translationTwo: string, book: string, chapter: number, verse: number) => Promise<any>;
    compareManyVerses: (translationOne: string, translationTwo: string, book: string, chapter: number, verseOne: number, verseTwo: number) => Promise<any>;
}

export const GeminiContext = createContext<GeminiContextProps | undefined>(undefined);

interface GeminiProviderProps {
    children: ReactNode;
}

export const GeminiProvider: React.FC<GeminiProviderProps> = (props) => {
    const baseUrl = 'http://localhost:3001/api/gemini/';

    const compareOneVerse = (translationOne: string, translationTwo: string, book: string, chapter: number, verse: number): Promise<any> => {
        return axios.get(`${baseUrl}compare-one/${translationOne}/${translationTwo}/${book}/${chapter}/${verse}`)
            .then(response => {
                return response.data;
            });
    };

    const compareManyVerses = (translationOne: string, translationTwo: string, book: string, chapter: number, verseOne: number, verseTwo: number): Promise<any> => {
        return axios.get(`${baseUrl}compare-many/${translationOne}/${translationTwo}/${book}/${chapter}/${verseOne}/${verseTwo}`)
            .then(response => {
                return response.data;
            });
    };

    return (
        <GeminiContext.Provider
            value={{
                compareOneVerse,
                compareManyVerses
            }}
        >
            {props.children}
        </GeminiContext.Provider>
    );
};
