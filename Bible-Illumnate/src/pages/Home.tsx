import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonPage, IonPopover, IonProgressBar, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { useContext, useRef, useState } from 'react';
import { books } from '../books';
import { search } from 'ionicons/icons'
import { VerseContext, callingManyVerseBody, callingOneVerseBody } from '../contexts/verseContext';
import { geminiResponse, useGemini } from '../contexts/geminiContext';
import TextDisplay from '../components/textDisplay';

const Home: React.FC = () => {

  const [geminiLoading, setGeminiLoading] = useState<boolean>(false);
  const [geminiResponse, setGeminiResponse] = useState<geminiResponse | undefined>();
  const [geminiMain, setGeminiMain] = useState<String | undefined>();
  const [geminiFunFact, setGeminiFunFact] = useState<String | undefined>();
  const [geminiCrossRef, setGeminiCrossRef] = useState<String | undefined>();
  const [geminiHistory, setGmeiniHistory] = useState<String | undefined>();
  const [geminiError, setGeminiError] = useState<boolean>(false)
  const [comparisonSaved, setComparisonSaved] = useState<boolean>(false)

  const [versesOne, setVersesOne] = useState<string | undefined>()
  const [versesTwo, setVersesTwo] = useState<string | undefined>()

  const [selectedBook, setSelectedBook] = useState<any | undefined>()
  const [selectedBookName, setSelectedBookName] = useState<string | undefined>()
  const [selectedChapter, setSelectedChapter] = useState<number | undefined>()
  const [selectedVerse, setSelectedVerse] = useState<number | undefined>()
  const [selectedEndingVerse, setSelectedEndingVerse] = useState<number | undefined>()
  const [selectedTranslation, setSelectedTranslation] = useState<String>("NLT")
  const [selectedCompareTranslation, setSelectedCompareTranslation] = useState<String | undefined>()

  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);

  const [bookPopoverOpen, setBookPopoverOpen] = useState(false);
  const [chapterPopoverOpen, setChapterPopoverOpen] = useState(false);
  const [versePopoverOpen, setVersePopoverOpen] = useState(false);
  const [endingVersePopoverOpen, setEndingVersePopoverOpen] = useState(false);
  const [translationPopoverOpen, setTranslationPopoverOpen] = useState(false);
  const [translationComparePopoverOpen, setTranslationComparePopoverOpen] = useState(false)

  const [readyForCompare, setReadyForCompare] = useState(false)

  const { getOneVerse, getManyVerses } = useContext(VerseContext);
  const { compareOneVerse, compareManyVerses, saveComparison } = useGemini();

  //Research One
  async function compareVerse() {
    setGeminiMain(undefined)
    setGeminiFunFact(undefined)
    setGeminiCrossRef(undefined)
    setComparisonSaved(false)
    setGeminiError(false)
    setGeminiLoading(true)

    if (!selectedChapter) {
      return
    }
    if (!selectedVerse) {
      return
    }

    
  }

  //Research Many
  async function compareVerses() {
    setGeminiMain(undefined)
    setGeminiFunFact(undefined)
    setGeminiCrossRef(undefined)
    setComparisonSaved(false)
    setGeminiError(false)
    if (!selectedCompareTranslation) {
      return
    }
    if (!selectedChapter) {
      return
    }
    if (!selectedVerse) {
      return
    }
    if (!selectedEndingVerse) {
      return
    }
    if (selectedVerse === selectedEndingVerse) {
      try {
        await compareOneVerse(selectedTranslation.toString(), selectedCompareTranslation.toString(), selectedBook.name, selectedChapter, selectedVerse)
          .then((res) => {
            setGeminiLoading(false)
            setGeminiResponse(res)
            if (res.main) {
              setGeminiMain(res.main)
            } else {
              setGeminiMain("Something went wrong, please try again")
            }
            if (res.funFact) {
              setGeminiFunFact(res.funFact)
            }
            if (res.crossRef) {
              setGeminiCrossRef(res.crossRef)
            }
            if (res.history) {
              setGmeiniHistory(res.history)
            }
          })
      } catch {
        setGeminiLoading(false)
        setGeminiError(true)
      }
    } else {
      try {
        await compareManyVerses(selectedTranslation.toString(), selectedCompareTranslation.toString(), selectedBook.name, selectedChapter, selectedVerse, selectedEndingVerse)
          .then((res) => {
            setGeminiLoading(false)
            setGeminiResponse(res)
            if (res.main) {
              setGeminiMain(res.main)
            } else {
              setGeminiMain("Something went wrong, please try again")
            }
            if (res.funFact) {
              setGeminiFunFact(res.funFact)
            }
            if (res.crossRef) {
              setGeminiCrossRef(res.crossRef)
            }
            if (res.history) {
              setGmeiniHistory(res.history)
            }
          })
      } catch {
        setGeminiLoading(false)
        setGeminiError(true)
      }
    }
  }

  async function saveSetComparison() {
    if (!geminiResponse) {
      return
    }
    if (selectedVerse === selectedEndingVerse) {
      geminiResponse.passage = `${selectedBook.name} ${selectedChapter}, ${selectedVerse}`
    } else {
      geminiResponse.passage = `${selectedBook.name} ${selectedChapter}, ${selectedVerse} - ${selectedEndingVerse}`
    }
    geminiResponse.translations = `${selectedTranslation} - ${selectedCompareTranslation}`
    geminiResponse.creationDate = Date.now()
    setComparisonSaved(true)
    await saveComparison(geminiResponse)
  }

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

  async function translationRefresh(forWhat: number, translationOne: string, translationTwo: string) {
    if (forWhat === 1) {
      let verses = getNumbersInRange(selectedVerse, selectedEndingVerse)
      if (verses === null) {
        return
      }

      if (verses.length === 1) {
        if (!selectedVerse) {
          return
        }
        if (!selectedChapter) {
          return
        }
        let verseId = translateSelectedVerse(selectedVerse)
        if (!verseId) {
          return
        }

        let data: callingOneVerseBody = {
          selectedTranslation: translationOne,
          selectedBook: selectedBook.id,
          selectedChapter: selectedChapter.toString(),
          verseId: verseId
        }
        let res = await getOneVerse(data)
        setVersesOne(res.verse)
      } else {
        let verseArr: any = [];
        verses.forEach(verse => {
          verseArr.push(translateSelectedVerse(verse));
        });

        if (!selectedChapter) {
          return
        }

        let data: callingManyVerseBody = {
          selectedTranslation: translationOne,
          selectedBook: selectedBook.id,
          selectedChapter: selectedChapter.toString(),
          verseArr: verseArr
        }

        try {
          let res = await getManyVerses(data);

          if (res) {
            let returnedVerse = res.map(verse => `${verse.verseId} ${verse.verse} `).join('');
            setVersesOne(returnedVerse)
          } else {
            console.error('Invalid response structure:', res);
          }
        } catch (error) {
          console.error('Error fetching verses:', error);
        }

      }
    } else if (forWhat === 2) {
      let verses = getNumbersInRange(selectedVerse, selectedEndingVerse)
      if (verses === null) {
        return
      }
      if (verses.length === 1) {
        if (!selectedVerse) {
          return
        }
        if (!selectedChapter) {
          return
        }
        let verseId = translateSelectedVerse(selectedVerse)
        if (!verseId) {
          return
        }
        let data: callingOneVerseBody = {
          selectedTranslation: translationTwo,
          selectedBook: selectedBook.id,
          selectedChapter: selectedChapter.toString(),
          verseId: verseId
        }
        let res = await getOneVerse(data)
        setVersesTwo(res.verse)
      } else {
        let verseArr: any = [];
        verses.forEach(verse => {
          verseArr.push(translateSelectedVerse(verse));
        });
        if (!selectedChapter) {
          return
        }
        let data: callingManyVerseBody = {
          selectedTranslation: translationTwo,
          selectedBook: selectedBook.id,
          selectedChapter: selectedChapter.toString(),
          verseArr: verseArr
        }
        try {
          let res = await getManyVerses(data);
          if (res) {
            let returnedVerse = res.map(verse => `${verse.verseId} ${verse.verse} `).join('');
            setVersesTwo(returnedVerse)
          } else {
            console.error('Invalid response structure:', res);
          }
        } catch (error) {
          console.error('Error fetching verses:', error);
        }
      }
    }
  }

  async function callVerses() {
    let verses = getNumbersInRange(selectedVerse, selectedEndingVerse)
    if (verses === null) {
      return
    }

    if (verses.length === 1) {
      if (!selectedVerse) {
        return
      } else if (!selectedChapter) {
        return
      }
      let verseId = translateSelectedVerse(selectedVerse)
      if (!verseId) {
        return
      }

      let data: callingOneVerseBody = {
        selectedTranslation: selectedTranslation.toString(),
        selectedBook: selectedBook.id,
        selectedChapter: selectedChapter.toString(),
        verseId: verseId
      }

      if (readyForCompare && selectedCompareTranslation) {
        translationRefresh(2, selectedTranslation.toString(), selectedCompareTranslation.toString())
      }

      let res = await getOneVerse(data)
      setReadyForCompare(true)
      setVersesOne(res.verse)
    } else {
      let verseArr: any = [];
      verses.forEach(verse => {
        verseArr.push(translateSelectedVerse(verse));
      });

      if (!selectedChapter) {
        return
      }

      let data: callingManyVerseBody = {
        selectedTranslation: selectedTranslation.toString(),
        selectedBook: selectedBook.id,
        selectedChapter: selectedChapter.toString(),
        verseArr: verseArr
      }

      if (readyForCompare && selectedCompareTranslation) {
        translationRefresh(2, selectedTranslation.toString(), selectedCompareTranslation.toString())
      }

      let res = await getManyVerses(data);

      if (res) {
        let returnedVerse = res.map(verse => `${verse.verseId} ${verse.verse} `).join('');
        setReadyForCompare(true)
        setVersesOne(returnedVerse)
      } else {
        console.error('Invalid response structure:', res);
      }

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

  const handleTranslationClick = (translation: string) => {
    setSelectedTranslation(translation);
    setTranslationPopoverOpen(false);

    translationRefresh(1, translation, "NLT")
  };

  const handleTranslationCompareClick = (translation: string) => {
    setSelectedCompareTranslation(translation);
    setTranslationComparePopoverOpen(false);

    translationRefresh(2, selectedTranslation.toString(), translation)
  };

  const handleBookClick = (book: string) => {
    handleSetSelectedBook(book);
    setBookPopoverOpen(false);

    setSelectedChapter(undefined)
    setSelectedVerse(undefined)
    setSelectedEndingVerse(undefined)
  };

  const handleChapterClick = (chapter: number) => {
    handleSetSelectedChapter(chapter);
    setChapterPopoverOpen(false);
  };

  const handleVerseClick = (num: number) => {
    handleSetSelectedVerse(num);
    handleSetSelectedEndingVerse(num)
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

  function multiVerse() {
    if (selectedVerse === selectedEndingVerse) {
      return selectedVerse
    } else {
      return `${selectedVerse} - ${selectedEndingVerse}`
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
                <IonIcon
                  className='search-icon'
                  icon={search}></IonIcon>
                <div className='search-word'>
                  {versesOne ? (
                    <>
                      {selectedBook.name} {selectedChapter}, {multiVerse()}
                    </>
                  ) : (
                    <>
                      Search Verses
                    </>
                  )}
                </div>
              </IonRow>
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Verse Card 1 */}
        {versesOne ? (
          <>
            <br />
            <IonRow>
              <IonCol size='12' sizeLg='6'>
                <IonCard
                  className='verse-card'>
                  <IonCardContent>

                    <IonButton
                      fill='clear'
                      className='selector-translation-button'
                      id="select-translation"
                      expand="block"
                      onClick={() => setTranslationPopoverOpen(true)}
                    >
                      {selectedTranslation}
                    </IonButton>
                    <IonPopover
                      isOpen={translationPopoverOpen}
                      onDidDismiss={() => setTranslationPopoverOpen(false)}
                      trigger="select-translation"
                      size="auto"
                      className="custom-popover"
                    >
                      <div key="NLT1" className='item-selector-button' onClick={() => handleTranslationClick("NLT")}>NLT</div>
                      <div key="KJV1" className='item-selector-button' onClick={() => handleTranslationClick("KJV")}>KJV</div>
                      <div key="ESV1" className='item-selector-button' onClick={() => handleTranslationClick("ESV")}>ESV</div>
                      <div key="NIV1" className='item-selector-button' onClick={() => handleTranslationClick("NIV")}>NIV</div>
                      <div key="ASV1" className='item-selector-button' onClick={() => handleTranslationClick("ASV")}>ASV</div>
                    </IonPopover>

                    <IonCard className='inner-verse-card'>
                      <IonCardContent>
                        {versesOne}
                      </IonCardContent>
                    </IonCard>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              {readyForCompare ? (
                <>
                  <IonCol size='12' sizeLg='6'>
                    <IonCard
                      className='verse-card'>
                      <IonCardContent>

                        <IonButton
                          fill='clear'
                          className='selector-translation-button'
                          id="select-compare-translation"
                          expand="block"
                          onClick={() => setTranslationComparePopoverOpen(true)}
                        >
                          {selectedCompareTranslation ? (
                            <>
                              {selectedCompareTranslation}
                            </>
                          ) : (
                            <>
                              Select Translation
                            </>
                          )}
                        </IonButton>
                        <IonPopover
                          isOpen={translationComparePopoverOpen}
                          onDidDismiss={() => setTranslationComparePopoverOpen(false)}
                          trigger="select-compare-translation"
                          size="auto"
                          className="custom-popover"
                        >
                          <div key="NLT2" className='item-selector-button' onClick={() => handleTranslationCompareClick("NLT")}>NLT</div>
                          <div key="KJV2" className='item-selector-button' onClick={() => handleTranslationCompareClick("KJV")}>KJV</div>
                          <div key="ESV2" className='item-selector-button' onClick={() => handleTranslationCompareClick("ESV")}>ESV</div>
                          <div key="NIV2" className='item-selector-button' onClick={() => handleTranslationCompareClick("NIV")}>NIV</div>
                          <div key="ASV2" className='item-selector-button' onClick={() => handleTranslationCompareClick("ASV")}>ASV</div>
                        </IonPopover>

                        <IonCard className='inner-verse-card'>
                          <IonCardContent>
                            {versesTwo ? (
                              <>
                                {versesTwo}
                              </>
                            ) : (
                              <>
                                Click the button above to select a translation to compare to!
                              </>
                            )}
                          </IonCardContent>
                        </IonCard>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  {versesTwo ? (
                    <>
                      <br /><br /><br /><br />
                    </>
                  ) : (
                    <>
                    </>
                  )}
                </>
              ) : (
                <>
                </>
              )}
            </IonRow>
          </>
        ) : (
          <>
            <IonRow>
              <IonCol size='0' sizeLg='3'></IonCol>
              <IonCol sizeLg='6'>
                <IonCard
                  className='verse-card'>
                  <IonCardContent>

                    <IonButton
                      fill='clear'
                      className='selector-translation-button'
                      expand="block"
                    >
                      Bible Illumnate
                    </IonButton>
                    <IonCard className='inner-verse-card'>
                      <IonCardContent>
                        Search for a verse to compare! Click the search bar above.
                      </IonCardContent>
                    </IonCard>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </>
        )}
        <div className='gemini-word gemini-footprint'>Made with Gemini</div>
        {versesTwo ? (
          <>
            <IonRow>
              <IonCol size='6'>
              </IonCol>
              <IonCol size='6'>
                <IonCard className='verse-card footer'>
                  <IonCardContent>
                    <IonButton
                      fill='clear'
                      className='compare-button'
                      expand="block"
                      onClick={() => {
                        compareVerses();
                        setIsModalTwoOpen(true);
                      }}>
                      Compare
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </>

        ) : (
          <>
          </>
        )}
        <IonModal isOpen={isModalTwoOpen}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setIsModalTwoOpen(false)}>Close</IonButton>
              </IonButtons>
              <IonTitle slot='end' className='gemini-word'><b>Google Gemini</b></IonTitle>
            </IonToolbar>
            {geminiLoading ? (
              <>
                <IonProgressBar type="indeterminate"></IonProgressBar>
              </>
            ) : <>
            </>}
          </IonHeader>
          <IonContent className="ion-padding">
            <IonRow>
              {geminiLoading ? (
                <>
                </>
              ) : (
                <>
                  {geminiError ? (
                    <>
                      <IonCard className='cross-reference'>
                        <IonCardContent>
                          An error has occured, please try again
                        </IonCardContent>
                      </IonCard>
                    </>
                  ) : (
                    <>
                    </>
                  )}
                  {geminiMain ? (
                    <>
                      <IonCard className='main-res'>
                        <IonCardContent>
                          <div className='gemini-card-header'>
                            Main Differences
                          </div>
                          <TextDisplay text={geminiMain} />
                        </IonCardContent>
                      </IonCard>
                    </>
                  ) : (
                    <>
                    </>
                  )}
                  {geminiHistory ? (
                    <>
                      <IonCard className='history'>
                        <IonCardContent>
                          <div className='gemini-card-header'>
                            History
                          </div>
                          <TextDisplay text={geminiHistory} />
                        </IonCardContent>
                      </IonCard>
                    </>
                  ) : (
                    <>
                    </>
                  )}
                  {geminiCrossRef ? (
                    <>
                      <IonCard className='cross-reference'>
                        <IonCardContent>
                          <div className='gemini-card-header'>
                            Cross-References
                          </div>
                          <TextDisplay text={geminiCrossRef} />
                        </IonCardContent>
                      </IonCard>
                    </>
                  ) : (
                    <>
                    </>
                  )}
                  {geminiFunFact ? (
                    <>
                      <IonCard className='fun-fact'>
                        <IonCardContent>
                          <div className='gemini-card-header'>
                            Did you know?
                          </div>
                          <TextDisplay text={geminiFunFact} />
                        </IonCardContent>
                      </IonCard>
                      <br /><br /><br /><br />
                    </>
                  ) : (
                    <>
                    </>
                  )}
                  {geminiLoading ? (
                    <>
                    </>
                  ) : (
                    <>
                      {geminiError ? (
                        <>
                        </>
                      ) : (
                        <>
                          <IonRow>
                            <IonCol size='6'>
                            </IonCol>
                            {comparisonSaved ? (
                              <>
                                <IonCol size='6'>
                                  <IonCard className='verse-card footer'>
                                    <IonCardContent>
                                      <div
                                        className='compared-button'>
                                        Saved
                                      </div>
                                    </IonCardContent>
                                  </IonCard>
                                </IonCol>
                              </>
                            ) : (
                              <>
                                <IonCol size='6'>
                                  <IonCard className='verse-card footer'>
                                    <IonCardContent>
                                      <IonButton
                                        fill='clear'
                                        className='compare-button'
                                        expand="block"
                                        onClick={() => {
                                          saveSetComparison()
                                        }}>
                                        Save
                                      </IonButton>
                                    </IonCardContent>
                                  </IonCard>
                                </IonCol>
                              </>
                            )}
                          </IonRow>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </IonRow>
          </IonContent>
        </IonModal>
        {/* Selector Modal */}
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
                  trigger="select-chapter"
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
