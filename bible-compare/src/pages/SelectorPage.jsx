import { Button, Card, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { books } from '../assets/books'
import { useContext, useState } from 'react'
import { VerseContext } from '../contexts/verseContext'


function SelectorPage() {
    const [selectedTranslation, setSelectedTranslation] = useState("NLT")
    const [selectedBook, setSelectedBook] = useState(books[0])
    const [selectedChapter, setSelectedChapter] = useState(1)
    const [selectedVerse, setSelectedVerse] = useState(1)
    const [selectedEndingVerse, setSelectedEndingVerse] = useState(1)
    const [verse, setVerse] = useState(undefined)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { getVerse, getVerses } = useContext(VerseContext)

    function translateSelectedVerse(verse) {
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

        let newSelectedVerse = verse
        if (verse < 9) {
            newSelectedVerse = `00${verse}`
        } else if (selectedVerse < 99) {
            newSelectedVerse = `0${verse}`
        }

        let verseId = `${newSelectedBook}${newSelectedChapter}${newSelectedVerse}`
        return verseId
    }

    function getNumbersInRange(num1, num2) {
        let result = [];
        if (num1 === num2) {
            result.push(num1);
            return result;
        } else if (num1 < num2) {
            let maxNumbers = Math.min(num2 - num1 - 1, 3);
            for (let i = 0; i <= maxNumbers + 1; i++) {
                result.push(num1 + i);
            }
        }
        return result;
    }

    async function handleSetSelectedVerse(num) {
        setSelectedVerse(num)
        setSelectedEndingVerse(num)
    }

    async function handleSetSelectedEndingVerse(num) {

        setSelectedEndingVerse(num)

        let verses = getNumbersInRange(selectedVerse, num)

        if (verses.length === 1) {
            let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse),)
            setVerse(res.verse)
        } else {
            let verseArr = []
            verses.map((verse) => {
                verseArr.push(translateSelectedVerse(verse))
            })
            let res = await getVerses(selectedTranslation, selectedBook.id, selectedChapter, verseArr)

            let returnedVerse
            res.map((verse) => {
                if (returnedVerse) {
                    returnedVerse = returnedVerse + `${verse.verseId} ${verse.verse} `
                } else {
                    returnedVerse = `${verse.verseId} ${verse.verse} `
                }
            })
            setVerse(returnedVerse)
        }
    }


    async function handleSetSelectedChapter(num,) {
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

    function numberOfEndingVerses() {
        const book = books.find(book => book.name === selectedBook.name);

        if (book) {
            // Find the chapter object within the book's chapters array
            const chapter = book.chapters.find(chapter => chapter.number === selectedChapter);

            function findAmountOfVersesPlus4(amountOfVerses) {
                // console.log(selectedVerse)
                // console.log(amountOfVerses)
                if (selectedVerse === amountOfVerses) {
                    return selectedVerse + 1
                } else if (selectedVerse === amountOfVerses - 1) {
                    return selectedVerse + 2
                } else if (selectedVerse === amountOfVerses - 2) {
                    return selectedVerse + 3
                } else if (selectedVerse === amountOfVerses - 3) {
                    return selectedVerse + 4
                } else {
                    return selectedVerse + 5

                }
            }

            if (chapter) {
                let dropdowns = []
                let versesInEndingDropdown = findAmountOfVersesPlus4(chapter.verses)
                for (let i = selectedVerse; i < versesInEndingDropdown; i++) {
                    dropdowns.push(<Dropdown.Item onClick={(e) => handleSetSelectedEndingVerse(i)}>{i}</Dropdown.Item>)
                }
                return dropdowns
            } else {
                return 'Chapter not found';
            }
        } else {
            return 'Book not found';
        }
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton
                    className='model-color'>
                    <Modal.Title>Selector</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className='model-color'>
                    <Row>
                        <div className='col-6'>
                            <Dropdown>
                                <Dropdown.Toggle
                                    className='col-12 dropdown-color'>
                                    {selectedBook.name}
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                    className='col-12 dropdown-content-color'>
                                    {bookArr.map((book) => {
                                        return <Dropdown.Item key={book}
                                            onClick={(e) => handleSetSelectedBook(e.target.textContent)}>{book}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className='col-6'>
                            <Dropdown>
                                <Dropdown.Toggle
                                    className='col-12 dropdown-color'>
                                    Chapter {selectedChapter}
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                    className='col-12 dropdown-content-color'>
                                    {numberOfChapters()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Row>
                    <br />
                    <Row>
                        <div className='col-4'>
                            <Dropdown>
                                <Dropdown.Toggle
                                    className='col-12 dropdown-color'>
                                    Verse {selectedVerse}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {numberOfVerses()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className='col-4 selector-inbetween'>
                            to
                        </div>
                        <div className='col-4'>
                            <Dropdown>
                                <Dropdown.Toggle
                                    className='col-12 dropdown-color'>
                                    Verse {selectedEndingVerse}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {numberOfEndingVerses()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Row>
                </Modal.Body>
                <Modal.Footer
                    className='model-color'>
                    <Button variant="primary" onClick={handleClose}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
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
                                return <Dropdown.Item key={book + "2"}
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
                <br />
                <Row>
                    <Card
                        className='verse-card'>
                        <Card.Body>
                            {verse ? (
                                <>
                                    {verse}
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Row>
                <Row>
                    <div className='footer'>
                        <div className='selector-button'
                            onClick={handleShow}>
                            <div className='selector-button-text'>
                                {selectedBook.name} {selectedChapter}
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        </>
    )
}
export default SelectorPage