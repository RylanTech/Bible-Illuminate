import axios from "axios";
import { ReactNode, createContext } from "react";
export interface callingOneVerseBody {
    selectedTranslation: string,
    selectedBook: string,
    selectedChapter: string,
    verseId: string
}

export interface callingManyVerseBody {
    selectedTranslation: string,
    selectedBook: string,
    selectedChapter: string,
    verseArr: Array<string>
}

export interface verseResponse {
    book: book,
    chapterId: number,
    id: number,
    verse: string,
    verseId: number
}

export interface book {
    id: number,
    name: string,
    testament: string
}

interface verseCallingContextProps {
    getOneVerse: (data: callingOneVerseBody) => Promise<verseResponse>;
    getManyVerses: (data: callingManyVerseBody) => Promise<verseResponse[]>; // Updated to return an array directly
}

interface VerseContextProviderProps {
    children: ReactNode;
}


export const VerseContext = createContext<verseCallingContextProps>({
    getOneVerse: (data: callingOneVerseBody) => Promise.resolve({} as verseResponse),
    getManyVerses: (data: callingManyVerseBody) => Promise.resolve([] as verseResponse[]) // Default to empty array
});

const BASE_URL = 'https://bibleilluminate.com/api/'

export const VerseProvider = ({ children }: VerseContextProviderProps) => {

    async function getOneVerse(data: callingOneVerseBody): Promise<verseResponse> {
        try {
            const response = await axios.post<verseResponse>(BASE_URL + "bible/get-verse", {
                translation: data.selectedTranslation,
                book: data.selectedBook,
                chapter: data.selectedChapter,
                verse: data.verseId
            });
            return response.data;
        } catch (error) {
            throw new Error('Error fetching verse');
        }
    }
    async function getManyVerses(data: callingManyVerseBody): Promise<verseResponse[]> {
        try {
            const response = await axios.post<verseResponse[]>(BASE_URL + "bible/get-verses", {
                translation: data.selectedTranslation,
                book: data.selectedBook,
                chapter: data.selectedChapter,
                verseArr: data.verseArr
            });
            return response.data; // Directly return the array of verses
        } catch (error) {
            throw new Error('Error fetching verses');
        }
    }
    

    return (
        <VerseContext.Provider value={{ 
            getOneVerse, 
            getManyVerses 
        }}>
            {children}
        </VerseContext.Provider>
    );
};
