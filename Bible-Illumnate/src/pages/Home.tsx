import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonPage, IonPopover, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { useRef, useState } from 'react';
import { books } from '../books';
import { search } from 'ionicons/icons'

const Home: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<any | undefined>()
  const [selectedBookName, setSelectedBookName] = useState<string | undefined>()
  const [selectedChapter, setSelectedChapter] = useState<number | undefined>()
  const [selectedVerse, setSelectedVerse] = useState<number | undefined>()
  const [selectedEndingVerse, setSelectedEndingVerse] = useState<number | undefined>()
  const [apiCallURLs, setApiCallURLs] = useState<Array<string> | undefined>()
  const [apiCallCompareURLs, setApiCallCompareURLs] = useState<Array<string> | undefined>()

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const [bookPopoverOpen, setBookPopoverOpen] = useState(false);
  const [chapterPopoverOpen, setChapterPopoverOpen] = useState(false);
  const [versePopoverOpen, setVersePopoverOpen] = useState(false);
  const [endingVersePopoverOpen, setEndingVersePopoverOpen] = useState(false);

  function confirm() {
    callVerses()
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  function translateSelectedVerse(verse: number) {
    if (selectedChapter === undefined) {
      return null
    }

    let newSelectedBook = selectedBook.id
    let newSelectedChapter = selectedChapter.toString()

    if (selectedChapter > 9 && selectedChapter < 99) {
      newSelectedChapter = `0${selectedChapter}`
    } else if (selectedChapter < 10) {
      newSelectedChapter = `00${selectedChapter}`
    }

    let newSelectedVerse = verse.toString()

    if (verse > 9 && verse < 99) {
      newSelectedVerse = `0${verse}`
    } else if (verse < 10) {
      newSelectedVerse = `00${verse}`
    }

    let verseId = `${newSelectedBook}${newSelectedChapter}${newSelectedVerse}`
    return verseId
  }

  function callVerses() {
    let verses = getNumbersInRange(selectedVerse, selectedEndingVerse)
    if (verses === null) {
      return
    }

    if (verses.length === 1) {

    } else {
      let verseArr: any = [];
      verses.forEach(verse => {
        verseArr.push(translateSelectedVerse(verse));
      });
      console.log(verseArr)
    }
  }

  function getNumbersInRange(num1: number | undefined, num2: number | undefined) {
    if (num1 === undefined) {
      return null
    } else if (num2 === undefined) {
      return null
    }

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

  const handleBookClick = (book: string) => {
    handleSetSelectedBook(book);
    setBookPopoverOpen(false);
  };

  const handleChapterClick = (chapter: number) => {
    handleSetSelectedChapter(chapter);
    setChapterPopoverOpen(false);
  };

  const handleVerseClick = (num: number) => {
    handleSetSelectedVerse(num);
    setVersePopoverOpen(false);
  };

  const handleEndingVerseClick = (num: number) => {
    handleSetSelectedEndingVerse(num);
    setEndingVersePopoverOpen(false);
  };

  async function handleSetSelectedBook(newBook: any) {

    let bookObject = books.find(book => book.name === newBook);
    setSelectedBook(bookObject)
    setSelectedBookName(bookObject?.name)
  }

  async function handleSetSelectedChapter(num: number) {
    setSelectedChapter(num)
  }

  async function handleSetSelectedVerse(num: number) {
    setSelectedVerse(num)
  }


  async function handleSetSelectedEndingVerse(num: number) {
    setSelectedEndingVerse(num);
    // let verses = getNumbersInRange(selectedVerse, num);
    // if (verses.length === 1) {
    //     let res = await getVerse(selectedTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse));
    //     setVerse(res.verse);
    //     let resTwo = await getVerse(selectedCompareTranslation, selectedBook.id, selectedChapter, translateSelectedVerse(selectedVerse));
    //     setCompareVerse(resTwo.verse);
    // } else {
    //     let verseArr = [];
    //     verses.forEach(verse => {
    //         verseArr.push(translateSelectedVerse(verse));
    //     });
    //     let res = await getVerses(selectedTranslation, selectedBook.id, selectedChapter, verseArr);
    //     let resTwo = await getVerses(selectedCompareTranslation, selectedBook.id, selectedChapter, verseArr);
    //     let returnedVerse = res.map(verse => `${verse.verseId} ${verse.verse} `).join('');
    //     setVerse(returnedVerse);
    //     let returnedCompareVerse = resTwo.map(verse => `${verse.verseId} ${verse.verse} `).join('');
    //     setCompareVerse(returnedCompareVerse);
    // }
  }

  const numberOfChapters = () => {
    if (selectedBook && selectedBook.chapters) {
      return selectedBook.chapters.map((chapter: any, index: number) => (
        <div
          key={index + 1}
          className='item-selector-button'
          onClick={() => handleChapterClick(index + 1)}>
          {index + 1}
        </div>
      ));
    }
    return null;
  };

  function numberOfVerses() {
    if (selectedBook != undefined) {
      const book = books.find(book => book.name === selectedBook.name);

      if (book) {
        // Find the chapter object within the book's chapters array
        const chapter = book.chapters.find(chapter => chapter.number === selectedChapter);

        if (chapter) {
          let dropdowns = []
          for (let i = 0; i < chapter.verses; i++) {
            dropdowns.push(
              <div
                key={i + 1}
                className='item-selector-button'
                onClick={() => handleVerseClick(i + 1)}>{i + 1}
              </div>)
          }
          return dropdowns
        } else {
          return 'Please Select Chapter';
        }
      } else {
        return 'Book not found';
      }
    } else {
      return 'Please Select Book'
    }
  }

  function numberOfEndingVerses() {

    if (selectedBook != undefined) {
      const book = books.find(book => book.name === selectedBook.name);

      if (book) {
        // Find the chapter object within the book's chapters array
        const chapter = book.chapters.find(chapter => chapter.number === selectedChapter);

        function findAmountOfVersesPlus4(amountOfVerses: number, selectedVerse?: number): number {
          if (selectedVerse === undefined) {
            // Set a default value for selectedVerse if it is undefined
            selectedVerse = 0;
          }

          // console.log(selectedVerse)
          // console.log(amountOfVerses)

          if (selectedVerse === amountOfVerses) {
            return selectedVerse + 1;
          } else if (selectedVerse === amountOfVerses - 1) {
            return selectedVerse + 2;
          } else if (selectedVerse === amountOfVerses - 2) {
            return selectedVerse + 3;
          } else {
            let i = selectedVerse + 4;
            return i
          }
        }


        if (chapter) {
          let dropdowns = [];
          let versesInEndingDropdown = findAmountOfVersesPlus4(chapter.verses, selectedVerse);

          // Ensure i is properly initialized and properly typed
          for (let i = selectedVerse || 0; i < versesInEndingDropdown; i++) {
            dropdowns.push(
              <div
                key={i}
                className='item-selector-button'
                onClick={() => handleEndingVerseClick(i)}>
                {i}
              </div>
            );
          }
          return dropdowns;
        } else {
          return 'Please select Chapter';
        }

      } else {
        return 'Book not found';
      }
    } else {
      return 'Please select Book'
    }
  }

  let bookArr: string[] = []
  books.map((book) => {
    bookArr.push(book.name)
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className='selector-bar'>
            <IonButton fill='clear' className='selector-button' id="open-modal" expand="block">
              <IonRow>
                <IonIcon icon={search}></IonIcon>
                <div className='search-word'>
                  Search Verses
                </div>
              </IonRow>
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonModal ref={modal} trigger="open-modal">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Select Verse</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonRow>
              <IonCol size="12">
                <IonButton
                  fill='clear'
                  className='selector-button'
                  id="select-book"
                  expand="block"
                  onClick={() => setBookPopoverOpen(true)} // Open the popover
                >
                  {selectedBookName ? (
                    <>
                      {selectedBookName}
                    </>
                  ) : (
                    <>
                      Book
                    </>
                  )}
                </IonButton>
              </IonCol>
              <IonPopover
                isOpen={bookPopoverOpen}
                onDidDismiss={() => setBookPopoverOpen(false)}
                trigger="select-book"
                size="auto"
                className="custom-popover"
              >
                {bookArr.map((book) => {
                  return (
                    <div
                      key={book}
                      className='item-selector-button'
                      onClick={() => handleBookClick(book)}
                    >
                      {book}
                    </div>
                  )
                })}
              </IonPopover>
              <IonCol size="12">
                <IonButton
                  fill='clear'
                  className='selector-button'
                  id="select-chapter"
                  expand="block"
                  onClick={() => setChapterPopoverOpen(true)}
                >
                  {selectedChapter ? (
                    <>
                      Chapter {selectedChapter}
                    </>
                  ) : (
                    <>
                      Chapter
                    </>
                  )}
                </IonButton>
                <IonPopover
                  isOpen={chapterPopoverOpen}
                  onDidDismiss={() => setChapterPopoverOpen(false)}
                  size="auto"
                  className="custom-popover"
                >
                  {numberOfChapters()}
                </IonPopover>
              </IonCol>
              <IonCol size="12">
                <IonButton
                  fill='clear'
                  className='selector-button'
                  id="select-verse"
                  expand="block"
                  onClick={() => setVersePopoverOpen(true)}>
                  {selectedVerse ? (
                    <>
                      Verse {selectedVerse}
                    </>
                  ) : (
                    <>
                      Start Verse
                    </>
                  )}
                </IonButton>
              </IonCol>
              <IonPopover
                isOpen={versePopoverOpen}
                trigger="select-verse"
                size="auto"
                className="custom-popover">
                {numberOfVerses()}
              </IonPopover>
              <IonCol size="12">
                <IonButton
                  fill='clear'
                  className='selector-button'
                  id="select-ending-verse"
                  expand="block"
                  onClick={() => setEndingVersePopoverOpen(true)}>
                  {selectedEndingVerse ? (
                    <>
                      Verse {selectedEndingVerse}
                    </>
                  ) : (
                    <>
                      Ending Verse
                    </>
                  )}
                </IonButton>
              </IonCol>
              <IonPopover
                isOpen={endingVersePopoverOpen}
                trigger="select-ending-verse"
                size="auto"
                className="custom-popover">
                {numberOfEndingVerses()}
              </IonPopover>
            </IonRow>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
