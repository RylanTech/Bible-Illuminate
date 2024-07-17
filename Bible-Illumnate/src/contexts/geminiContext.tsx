import axios from "axios";
import React, { createContext, ReactNode, useContext } from "react";

interface GeminiContextProps {
    compareOneVerse: (translationOne: string, translationTwo: string, book: string, chapter: number, verse: number) => Promise<any>;
    compareManyVerses: (translationOne: string, translationTwo: string, book: string, chapter: number, verseOne: number, verseTwo: number) => Promise<any>;
    saveComparison: (comparisonData: JSON) => Promise<any>;
    getComparisons: () => Promise<any>
}

const GeminiContext = createContext<GeminiContextProps | undefined>(undefined);

interface GeminiProviderProps {
    children: ReactNode;
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

    const saveComparison = async (compareData: JSON): Promise<any> => {

        const saveCompareData = (compareData: JSON): Promise<string> => {
            return new Promise((resolve, reject) => {
                try {
                    let compares = localStorage.getItem("saved-compares");
                    let parsedCompares = compares ? JSON.parse(compares) : [];
                    parsedCompares.push(compareData);
                    localStorage.setItem("saved-compares", JSON.stringify(parsedCompares));
                    resolve(JSON.stringify(parsedCompares));
                } catch (error) {
                    reject(error);
                }
            });
        };
        return await saveCompareData(compareData)
    };

    const getComparisons = async (): Promise<any> => {
        const getCompareData = (): Promise<JSON> => {
            return new Promise((resolve, reject) => {
                try {
                    let compares = localStorage.getItem("saved-compares");
                    let parsedCompares = compares ? JSON.parse(compares) : [];
                    resolve(parsedCompares);
                } catch (error) {
                    reject(error);
                }
            });
        };
        return await getCompareData
    };

    return (
        <GeminiContext.Provider value={{
            compareOneVerse,
            compareManyVerses,
            saveComparison,
            getComparisons
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
