import axios from "axios";
import React, { createContext, ReactNode, useContext } from "react";

interface GeminiContextProps {
    compareOneVerse: (translationOne: string, translationTwo: string, book: string, chapter: number, verse: number) => Promise<any>;
    compareManyVerses: (translationOne: string, translationTwo: string, book: string, chapter: number, verseOne: number, verseTwo: number) => Promise<any>;
    saveComparison: (comparisonData: geminiResponse) => Promise<any>;
    getComparisons: () => Promise<any>;
    deleteSavedComparison: (updatedList: geminiResponse[]) => Promise<any>;
}


const GeminiContext = createContext<GeminiContextProps | undefined>(undefined);

interface GeminiProviderProps {
    children: ReactNode;
}

export interface geminiResponse {
    main: string,
    crossRef: string,
    funFact: string,
    passage: string,
    translations: string,
    creationDate: Number,
    id: number,
  }


export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
    // const baseUrl = 'http://192.168.1.17:3001/api/gemini/';
    const baseUrl = 'http://localhost:3001/api/gemini/';

    const compareOneVerse = (translationOne: string, translationTwo: string, book: string, chapter: number, verse: number): Promise<any> => {
        return axios.get(`${baseUrl}compare-one/${translationOne}/${translationTwo}/${book}/${chapter}/${verse}`)
            .then(response => response.data);
    };

    const compareManyVerses = (translationOne: string, translationTwo: string, book: string, chapter: number, verseOne: number, verseTwo: number): Promise<any> => {
        return axios.get(`${baseUrl}compare-many/${translationOne}/${translationTwo}/${book}/${chapter}/${verseOne}/${verseTwo}`)
            .then(response => response.data);
    };

    const saveComparison = async (compareData: geminiResponse): Promise<any> => {

        let compares = localStorage.getItem("saved-compares");
        let parsedCompares = compares ? JSON.parse(compares) : [];
        compareData.id = parsedCompares.length
        parsedCompares.push(compareData);
        localStorage.setItem("saved-compares", JSON.stringify(parsedCompares));
        return JSON.stringify(parsedCompares);
    };

    const getComparisons = async (): Promise<any> => {
        let compares = localStorage.getItem("saved-compares");
        let parsedCompares = compares ? JSON.parse(compares) : [];
        return parsedCompares
    };

    const deleteSavedComparison = async (updatedList: geminiResponse[]): Promise<any> => {
        console.log(updatedList)
        localStorage.setItem("saved-compares", JSON.stringify(updatedList));
        return;
    };

    return (
        <GeminiContext.Provider value={{
            compareOneVerse,
            compareManyVerses,
            saveComparison,
            getComparisons,
            deleteSavedComparison
        }}>
            {children}
        </GeminiContext.Provider>
    );
};

// Custom hook for using the GeminiContext
export const useGemini = (): GeminiContextProps => {
    const context = useContext(GeminiContext);
    if (!context) {
        throw new Error("useGemini must be used within a GeminiProvider");
    }
    return context;
};
