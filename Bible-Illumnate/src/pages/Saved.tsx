import { IonButton, IonButtons, IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonModal, IonPage, IonRow, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { geminiResponse, useGemini } from "../contexts/geminiContext";
import { useState } from "react";
import TextDisplay from "../components/textDisplay";
import './Saved.css'


const Saved: React.FC = () => {
    const [comparisonList, setComparisonList] = useState<Array<geminiResponse> | undefined>([])

    const [geminiMain, setGeminiMain] = useState<string | undefined>()
    const [geminiCrossRef, setGeminiCrossRef] = useState<string | undefined>()
    const [geminiFunFact, setGeminiFunFact] = useState<string | undefined>()
    const [passage, setPassage] = useState<string | undefined>()
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const { getComparisons, deleteSavedComparison } = useGemini();

    useIonViewWillEnter(() => {
        async function getCompara() {
            let comparisons = await getComparisons()
            setComparisonList(comparisons)
        }
        getCompara()
    });

    function handleOpenModal(comparedData: geminiResponse) {
        setIsModalOpen(true)

        setGeminiMain(comparedData.main)
        setGeminiCrossRef(comparedData.crossRef)
        setGeminiFunFact(comparedData.funFact)
        setPassage(comparedData.passage)
    }

    async function handleDelete(comparedData: geminiResponse) {
        if (!comparisonList) {
            return;
        }
        
        const index = comparisonList.findIndex(item => JSON.stringify(item) === JSON.stringify(comparedData));
        
        // If the item is found, create a new array without the item
        let updatedComparisonList = [...comparisonList];
        if (index !== -1) {
            updatedComparisonList.splice(index, 1);
        }
        
        deleteSavedComparison(updatedComparisonList)
        setComparisonList(updatedComparisonList);
    }

    function getCompareDate(timestamp: number) {
        const date = new Date(timestamp);

        // Options for formatting the date
        const options = {
            weekday: 'short' as 'short',
            month: 'short' as 'short',
            day: 'numeric' as 'numeric',
            year: 'numeric' as 'numeric'
        };

        // Function to get the day suffix
        const daySuffix = (day: any) => {
            if (day > 3 && day < 21) return 'th'; // Special case for 11th to 13th
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        // Get the formatted date parts
        const formattedDate = date.toLocaleDateString('en-US', options);
        const parts = formattedDate.split(' ');

        const day = date.getDate();
        const dayWithSuffix = `${day}${daySuffix(day)}`;

        // Construct the final formatted date
        return `${parts[0]} ${parts[1]} ${dayWithSuffix}`;

    }

    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <div className="sc-heading">
                        Saved Compares
                        </div>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    {comparisonList?.length ? (
                        <>
                            {comparisonList.map((compara) => {
                                return (
                                    <div key={compara.id}>
                                        <IonItemSliding>
                                            <IonItem
                                                onClick={() => handleOpenModal(compara)}
                                                button={true}>
                                                {compara.passage}
                                                <div className="compared-date" slot="end">
                                                    {getCompareDate(parseInt(compara.creationDate.toString()))}
                                                </div>
                                            </IonItem>

                                            <IonItemOptions>
                                                <IonItemOption
                                                    onClick={() => handleDelete(compara)}
                                                    color="danger">Delete</IonItemOption>
                                            </IonItemOptions>
                                        </IonItemSliding>
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <IonItem>
                            Save a comparison and they will appear here
                        </IonItem>
                    )}
                    <IonModal isOpen={isModalOpen}>
                        <IonHeader>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonButton onClick={() => setIsModalOpen(false)}>Close</IonButton>
                                </IonButtons>
                                <IonTitle slot='end' className='gemini-word'><b>Google Gemini</b></IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding">
                            <IonRow>
                                {passage ? (
                                    <>
                                        <div className="passage-title">
                                            {passage}
                                        </div>
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
                                                    Fun Facts
                                                </div>
                                                <TextDisplay text={geminiFunFact} />
                                            </IonCardContent>
                                        </IonCard>
                                    </>
                                ) : (
                                    <>
                                    </>
                                )}
                            </IonRow>
                        </IonContent>
                    </IonModal>
                </IonContent>
            </IonPage>
        </>
    )
};

export default Saved;
