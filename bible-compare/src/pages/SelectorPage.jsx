import { Container, Dropdown, Row } from 'react-bootstrap'
import { books } from '../assets/books'
import { useContext, useState } from 'react'
import { VerseContext } from '../contexts/verseContext'


function SelectorPage() {
    const [selectedTranslation, setSelectedTranslation] = useState("NLT")
    const [selectedBook, setSelectedBook] = useState(books[0])
    const [selectedChapter, setSelectedChapter] = useState(1)
    const [selectedVerse, setSelectedVerse] = useState(1)
    const [verse, setVerse] = useState(undefined)

    const { getVerse } = useContext(VerseContext)

    function translateSelectedVerse() {
        let newSelectedBook = selectedBook.id
        if (selectedBook.id < 9) {
            newSelectedBook = `${selectedBook.id}0`
        }

        let newSelectedChapter = selectedChapter
        if (selectedChapter < 99) {
            newSelectedChapter = `0${selectedChapter}`
        } else if (selectedChapter < 9) {
            newSelectedChapter = `00${selectedChapter}`
        }

        let newSelectedVerse = selectedVerse
        if (selectedVerse < 9) {
            newSelectedVerse = `00${selectedVerse}`
        } else if (selectedVerse < 99) {
            newSelectedVerse = `0${selectedVerse}`
        }

        let verseId = `${newSelectedBook}${newSelectedChapter}${newSelectedVerse}`
        console.log(verseId)
        return verseId
    }

    async function handleSetSelectedVerse(num) {
        setSelectedVerse(num)

        let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse))
        setVerse(res)
    }

    async function handleSetSelectedChapter(num) {
        setSelectedChapter(num)
        setSelectedVerse(1)

        let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse))
        setVerse(res)
    }

    async function handleSetSelectedBook(newBook) {
        let bookObject = books.find(book => book.name === newBook);
        setSelectedBook(bookObject)
        setSelectedChapter(1)
        setSelectedVerse(1)

        let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse))
        setVerse(res)
    }

    async function handleSetSelectedTranslation(translation) {
        setSelectedTranslation(translation)

        let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse))
        setVerse(res)
    }

    let bookArr = []
    books.map((book) => {
        bookArr.push(book.name)
    })

    function numberOfChapters() {
        let chapterNumber = selectedBook.chapters.length
        let dropdowns = []
        for (let i = 0; i < chapterNumber; i++) {
            dropdowns.push(<Dropdown.Item onClick={(e) => handleSetSelectedChapter(i + 1)}>{i + 1}</Dropdown.Item>)
        }
        return dropdowns
    }

    function numberOfVerses() {
        const book = books.find(book => book.name === selectedBook.name);

        if (book) {
            // Find the chapter object within the book's chapters array
            const chapter = book.chapters.find(chapter => chapter.number === selectedChapter);

            if (chapter) {
                let dropdowns = []
                for (let i = 0; i < chapter.verses; i++) {
                    dropdowns.push(<Dropdown.Item onClick={(e) => handleSetSelectedVerse(i + 1)}>{i + 1}</Dropdown.Item>)
                }
                return dropdowns
            } else {
                return 'Chapter not found';
            }
        } else {
            return 'Book not found';
        }
    }

    return (
        <>
            <Container>
                <br />
                <Row>
                    <Dropdown
                        className='col-3'>
                        <Dropdown.Toggle
                            variant="success">
                            {selectedTranslation}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>NLT</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>KJV</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>ESV</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>NIV</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>ASV</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown
                        className='col-3'>
                        <Dropdown.Toggle
                            variant="success" >
                            {selectedBook.name}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {bookArr.map((book) => {
                                return <Dropdown.Item key={book}
                                    onClick={(e) => handleSetSelectedBook(e.target.textContent)}>{book}</Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown
                        className='col-3'>
                        <Dropdown.Toggle
                            variant="success">
                            Chapter {selectedChapter}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {numberOfChapters()}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown
                        className='col-3'>
                        <Dropdown.Toggle
                            variant="success">
                            Verse {selectedVerse}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {numberOfVerses()}
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>
                <Row>
                    <center>
                        {verse ? (
                            <>
                                {verse.verse}
                            </>
                        ) : (
                            <>
                            </>
                        )}
                    </center>
                </Row>
            </Container>
        </>
    )
}
export default SelectorPage