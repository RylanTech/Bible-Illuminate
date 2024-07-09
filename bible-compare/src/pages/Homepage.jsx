import { Button, Card, Container, Dropdown, Modal, Row } from 'react-bootstrap'
import { books } from '../assets/books'
import { useContext, useEffect, useState } from 'react'
import { VerseContext } from '../contexts/verseContext'
import { GeminiContext } from '../contexts/geminiContext'
import TextDisplay from '../Components/textDisplay'


function Homepage() {
    const [selectedTranslation, setSelectedTranslation] = useState("NLT")
    const [selectedCompareTranslation, setSelectedCompareTranslation] = useState("KJV")
    const [selectedBook, setSelectedBook] = useState(books[0])
    const [selectedChapter, setSelectedChapter] = useState(1)
    const [selectedVerse, setSelectedVerse] = useState(1)
    const [selectedEndingVerse, setSelectedEndingVerse] = useState(1)
    const [verse, setVerse] = useState(undefined)
    const [compareVerse, setCompareVerse] = useState(undefined)
    const [show, setShow] = useState(false);
    const [geminiRes, setGeminiRes] = useState(undefined)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { getVerse, getVerses } = useContext(VerseContext)
    const { compareOneVerse, compareManyVerses } = useContext(GeminiContext)

    async function handleCompare() {
        if (selectedVerse === selectedEndingVerse) {
            let res = await compareOneVerse(selectedTranslation, selectedCompareTranslation, selectedBook.name, selectedChapter, selectedVerse)
            setGeminiRes(res)
        } else {
            let res = await compareManyVerses(selectedTranslation, selectedCompareTranslation, selectedBook.name, selectedChapter, selectedVerse, selectedEndingVerse)
            setGeminiRes(res)
        }
    }

    function translateSelectedVerse(verse) {
        let newSelectedBook = selectedBook.id

        let newSelectedChapter = selectedChapter

        if (selectedChapter > 9 && selectedChapter < 99) {
            newSelectedChapter = `0${selectedChapter}`
        } else if (selectedChapter < 10) {
            newSelectedChapter = `00${selectedChapter}`
        }

        let newSelectedVerse = verse

        if (verse > 9 && verse < 99) {
            newSelectedVerse = `0${verse}`
        } else if (verse < 10) {
            newSelectedVerse = `00${verse}`
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
        let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse))
        setVerse(res.verse)
    }


    async function handleSetSelectedEndingVerse(num) {
        setSelectedEndingVerse(num);
        let verses = getNumbersInRange(selectedVerse, num);
        if (verses.length === 1) {
            let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse));
            setVerse(res.verse);
            let resTwo = await getVerse(selectedCompareTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse));
            setCompareVerse(resTwo.verse);
        } else {
            let verseArr = [];
            verses.forEach(verse => {
                verseArr.push(translateSelectedVerse(verse));
            });
            let res = await getVerses(selectedTranslation, selectedBook.id, selectedChapter, verseArr);
            let resTwo = await getVerses(selectedCompareTranslation, selectedBook.id, selectedChapter, verseArr);
            let returnedVerse = res.map(verse => `${verse.verseId} ${verse.verse} `).join('');
            setVerse(returnedVerse);
            let returnedCompareVerse = resTwo.map(verse => `${verse.verseId} ${verse.verse} `).join('');
            setCompareVerse(returnedCompareVerse);
        }
    }


    async function handleSetSelectedChapter(num,) {
        setSelectedChapter(num)
        setSelectedVerse(1)
        setSelectedEndingVerse(1)
        let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(1))
        setVerse(res.verse)
    }

    // async function handleSetSelectedBook(newBook) {
    //     let bookObject = books.find(book => book.name === newBook);
    //     await setSelectedBook(bookObject)
    //     setSelectedChapter(1)
    //     setSelectedVerse(1)
    //     setSelectedEndingVerse(1)
    //     console.log(bookObject)


    //     let res = await getVerse(selectedTranslation, bookObject.id, selectedChapter, translateSelectedVerse(1))
    //     setVerse(res.verse)
    //     let resTwo = await getVerse(selectedCompareTranslation, bookObject.id, selectedChapter, translateSelectedVerse(1))
    //     setCompareVerse(resTwo.verse)
    // }

    // useEffect(() => {
    //     if (selectedBook) {
    //         const fetchVerses = async () => {
    //             let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(1));
    //             setVerse(res.verse);
    //             let resTwo = await getVerse(selectedCompareTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(1));
    //             setCompareVerse(resTwo.verse);
    //         };

    //         fetchVerses();
    //     }
    // }, [selectedBook, selectedTranslation, selectedChapter, selectedVerse, selectedCompareTranslation]);

    async function handleSetSelectedBook(newBook) {
        let bookObject = books.find(book => book.name === newBook);
        setSelectedBook(bookObject);
        setSelectedChapter(1);
        setSelectedVerse(1);
        setSelectedEndingVerse(1);
        let res = await getVerse(selectedTranslation, bookObject.id, 1, translateSelectedVerse(1));
        setVerse(res.verse);
        let resTwo = await getVerse(selectedCompareTranslation, bookObject.id, 1, translateSelectedVerse(1));
        setCompareVerse(resTwo.verse);
    }
    

    async function handleSetSelectedTranslation(translation) {
        setSelectedTranslation(translation);
        let verses = getNumbersInRange(selectedVerse, selectedEndingVerse);
        if (verses.length === 1) {
            let res = await getVerse(translation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse));
            setVerse(res.verse);
        } else {
            let verseArr = [];
            verses.forEach(verse => {
                verseArr.push(translateSelectedVerse(verse));
            });
            let res = await getVerses(translation, selectedBook.id, selectedChapter, verseArr);
            let returnedVerse = res.map(verse => `${verse.verseId} ${verse.verse} `).join('');
            setVerse(returnedVerse);
        }
    }

    async function handleSetSelectedCompareTranslation(translation) {
        setSelectedCompareTranslation(translation);
        let verses = getNumbersInRange(selectedVerse, selectedEndingVerse);
        if (verses.length === 1) {
            let res = await getVerse(translation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse));
            setCompareVerse(res.verse);
        } else {
            let verseArr = [];
            verses.forEach(verse => {
                verseArr.push(translateSelectedVerse(verse));
            });
            let res = await getVerses(translation, selectedBook.id, selectedChapter, verseArr);
            let returnedVerse = res.map(rverse => `${rverse.verseId} ${rverse.verse} `).join('');
            setCompareVerse(returnedVerse);
        }
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
                } else {
                    return selectedVerse + 4
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

    function isOneVerse() {
        if (selectedVerse === selectedEndingVerse) {
            return selectedVerse
        } else {
            return `${selectedVerse} to ${selectedEndingVerse}`
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

                                <Dropdown.Menu
                                    className='col-12 dropdown-content-color'>
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

                                <Dropdown.Menu
                                    className='col-12 dropdown-content-color'>
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
                    <div className='col-12 col-md-7 col-lg-6'>
                        <Row>
                            <Card
                                className='selection-card'>
                                <Card.Body>
                                    <Dropdown

                                    >
                                        <Dropdown.Toggle
                                            className='col-12 dropdown-color'>
                                            {selectedTranslation}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu
                                            className='col-12 dropdown-content-color'>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>NLT</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>KJV</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>ESV</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>NIV</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedTranslation(e.target.textContent)}>ASV</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <br />
                                    <Card
                                        className='verse-card'>
                                        <Card.Body>
                                            {verse ? (
                                                <>
                                                    {verse}
                                                </>
                                            ) : (
                                                <>
                                                    Selected a verse to compare
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Card.Body>
                            </Card>
                        </Row>
                        <div className='full-passage'>
                            {selectedBook.name} - Chapter {selectedChapter}, verse {isOneVerse()}
                        </div>
                        <Row>
                            <Card
                                className='selection-card'>
                                <Card.Body>
                                    <Dropdown

                                    >
                                        <Dropdown.Toggle
                                            className='col-12 dropdown-color'>
                                            {selectedCompareTranslation}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu
                                            className='col-12 dropdown-content-color'>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedCompareTranslation(e.target.textContent)}>NLT</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedCompareTranslation(e.target.textContent)}>KJV</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedCompareTranslation(e.target.textContent)}>ESV</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedCompareTranslation(e.target.textContent)}>NIV</Dropdown.Item>
                                            <Dropdown.Item onClick={(e) => handleSetSelectedCompareTranslation(e.target.textContent)}>ASV</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <br />
                                    <Card
                                        className='verse-card'>
                                        <Card.Body>
                                            {compareVerse ? (
                                                <>
                                                    {compareVerse}
                                                </>
                                            ) : (
                                                <>
                                                    Selected a verse to compare
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Card.Body>
                            </Card>
                        </Row>
                    </div>
                    <div className='col-12 col-md-5 col-lg-6'>
                        <Card
                            className='compare-card'>
                            <Card.Body>
                                <Button
                                    onClick={() => handleCompare()}
                                    className='col-12 compare-button'>
                                    Compare
                                </Button>
                                <br /><br />
                                <div className='ai-res'>
                                    {geminiRes ? (
                                        <>
                                            <TextDisplay text={geminiRes} />
                                        </>
                                    ) : (
                                        <>
                                        </>
                                    )}
                                    <div className='powered-by'>
                                        Powered by <span class="gemini-word">Gemini</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Row>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
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
export default Homepage