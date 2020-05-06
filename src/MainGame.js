import React, { useState, useEffect } from "react";
import {CARDS, CARD_BACKGROUND, NUMBER_OF_CARDS_IN_HAND, NUMBER_OF_CARDS_ON_TABLE} from "./constants/constants";
import "./styles/game.scss";
import EndRoundModal from "./EndRoundModal";
import InformationModal from "./InformationModal";
import CardsPile from "./CardsPile";
import Result from "./Result";
import GameService from "./service/GameService";

function MainGame() {
  const [deck, setDeck] = useState([]);
  const [humanCards, setHumanCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);
  const [tableCards, setTableCards] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCardThrown, setIsCardThrown] = useState(false);
  const [humanCardsTaken, setHumanCardsTaken] = useState([]);
  const [computerCardsTaken, setComputerCardsTaken] = useState([]);
  const [isHumanTurn, setIsHumanTurn] = useState(false);
  const [humanTables, setHumanTables] = useState(0);
  const [computerTables, setComputerTables] = useState(0);
  const [computerPoints, setComputerPoints] = useState(0);
  const [humanPoints, setHumanPoints] = useState(0);
  const [isOpenedEndRoundDialog, setIsOpenedEndRoundDialog] = useState(false);
  const [isHumanCardDisabled, setIsHumanCardDisabled] = useState(true);
  const [isHumanLastThrowing, setIsHumanLastThrowing] = useState(false);
  const [canHumanTakeCards, setCanHumanTakeCards] = useState(true);
  const [isOpenModalCanHumanTakeCards, setIsOpenModalCanHumanTakeCards] = useState(false);
  const [isEndGameModalOpened, setIsEndGameModalOpened] = useState(false);
  const serviceGame = new GameService();

  const startGame = () => {
    const newCards = serviceGame.getShuffledCards([...CARDS]);
    dealCardsToHuman(newCards);
    dealTableCards(newCards);
    dealCardsToComputer(newCards);
    setDeck(newCards);
    setIsGameStarted(true);
  }

  const dealCards = () => {
    if (deck.length === 0) return;
    const newCards = [...deck];
    dealCardsToHuman(newCards);
    dealCardsToComputer(newCards);
    setDeck(newCards);
  }

  const dealCardsToHuman = (cards) => {
    let cardsForHuman = [];
    for (let i = 0; i < NUMBER_OF_CARDS_IN_HAND; i++) {
      cardsForHuman.push(cards.shift());
    }
    setHumanCards(cardsForHuman);
  }

  const dealCardsToComputer = (cards) => {
    let cardsForComputer = [];
    for (let i = 0; i < NUMBER_OF_CARDS_IN_HAND; i++) {
      cardsForComputer.push(cards.shift());
    }
    setComputerCards(cardsForComputer);
  }

  const dealTableCards = (cards) => {
    let cardsForTable = [];
    for (let i = 0; i < NUMBER_OF_CARDS_ON_TABLE; i++) {
      cardsForTable.push(cards.pop());
    }
    setTableCards(cardsForTable);
  }

  const humanThrowingCards = (image) => {
    setHumanCards(prevCards => ([...prevCards.filter((img) => img.src !== image.src)]))
    setTableCards(prevCards => ([...prevCards, image]));
    setIsCardThrown(true);
    setIsHumanTurn(false);
    setCanHumanTakeCards(true);
  }

  const toggleCardsOnTable = (image) => {
    if (!isHumanTurn || isHumanCardDisabled) return;
    image.isSelected = !image.isSelected;
    // update tableCards to apply isSelected change
    setTableCards([...tableCards]);
  }

  const closeEndRoundDialog = () => {
    setIsOpenedEndRoundDialog(false);
  };

  const closeModalCanHumanTakeCards = () => {
    setIsOpenModalCanHumanTakeCards(false);
  }

  const closeEndGameModal = () => {
    setIsEndGameModalOpened(false);
    window.location.reload(false);
  }
  
  const computerThrowingCards = (image) => {
    setTableCards(prevCards => ([...prevCards, image]));
    setComputerCards(prevCards => ([...prevCards.filter((img) => img.src !== image.src)]))
    setIsCardThrown(true);
    setIsHumanTurn(true);
  }

  const computerGame = () => {
    var allCombinations = [];
    for (let i = 0; i < computerCards.length; i++) {
      allCombinations = [...allCombinations, ...computerPickUpCards(computerCards[i], [...tableCards])];
    }
    // when allCombinations is empty, them computer throwing card with min value
    if (allCombinations.length === 0) {
      computerThrowingCards(serviceGame.getCardWithMinValue(computerCards));
    } else {
      const allCombinationsWithMaxPoints = serviceGame.getCombinationsWithMaxPoints(allCombinations);
      const allCombinationsWithMaxNumberOfCards = serviceGame.getCombinationsWithMaxNumberOfCards(allCombinationsWithMaxPoints);
      if (allCombinationsWithMaxPoints.length === 1) {
        setCardsWhenComputerPlay(allCombinationsWithMaxPoints);
      } else if (allCombinationsWithMaxPoints.length > 1 && allCombinationsWithMaxNumberOfCards.length >= 1) {
        setCardsWhenComputerPlay(allCombinationsWithMaxNumberOfCards);
      }
    }
  }

  const setCardsWhenComputerPlay = (combinations) => {
    for (let i = 0; i < combinations[0].cards.length; i++) {
      // return ace to original card
      if (combinations[0].cards[i].originalCard) {
        combinations[0].cards[i] = combinations[0].cards[i].originalCard;
      }
    }
    combinations[0].cards.forEach(c => {
      c.isSelected = true;
    });
    combinations[0].card.isFliped = true;
    setTimeout(() => {
      setTableCards(prevCards => ([...prevCards.filter((c) => {
        return !combinations[0].cards.find((crd => crd.src === c.src));
      })]));
      setComputerCards(prevCards => ([...prevCards.filter((c) => c.src !== combinations[0].card.src)]));
      setComputerCardsTaken([...combinations[0].cards, combinations[0].card, ...computerCardsTaken]);
    }, 1000);
    setIsHumanTurn(true);
    const points = serviceGame.getPointsOfCombination(combinations[0].card, combinations[0].cards);
    if (combinations[0].cards.length === tableCards.length) {
      setComputerTables(prevState => prevState + 1)
    }
    setComputerPoints((prevPoints) => prevPoints + points);
    setIsHumanLastThrowing(false);
    if ((computerPoints + points + computerTables) > 100) {
      setTimeout(() => {
        setIsEndGameModalOpened(true);
      }, 1000);
    }
  }

  const computerPickUpCards = (card, tableCards) => {
    if (serviceGame.isCardAce(card)) {
      card.value = 11;
    }
    var newTableCards = serviceGame.getCombinationsWithAce(tableCards);
    var cardsSet = newTableCards.filter(c => c.value <= card.value);
    var combinations = serviceGame.getCombinationsForSameValueCards(cardsSet, card)
    cardsSet = serviceGame.getAllCombinations(cardsSet, card);
    combinations = serviceGame.getCombinationsWithEqualSumAsCard(cardsSet, combinations, card);
    return combinations;
  }

  const humanPlay = (image) => {
    if (!isHumanTurn || isHumanCardDisabled) return;
    var selectedCards = tableCards.filter((img) => img.isSelected);
    if (selectedCards.length > 0) {
      const cardsWhichIsNotSelected = tableCards.filter((img) => !img.isSelected);
      const valuesOfSelectedCardsWhenAIs1 = [];
      const valuesOfSelectedCardsWhenAIs11 = [];
      serviceGame.getValuesOfSelectedCards(selectedCards, valuesOfSelectedCardsWhenAIs1, valuesOfSelectedCardsWhenAIs11);
      if (serviceGame.isCardAce(image)) {
        image.value = 11;
      }
      // sum all elements in first array when ace is 1
      let sumOfValuesWhenAceIs1 = 0;
      for (let i = 0; i < valuesOfSelectedCardsWhenAIs1.length; i++) {
        sumOfValuesWhenAceIs1 += valuesOfSelectedCardsWhenAIs1[i];
      }
      // sum all elements in second array when ace is 11
      let sumOfValuesWhenAceIs11 = 0;
      for (let i = 0; i < valuesOfSelectedCardsWhenAIs11.length; i++) {
        sumOfValuesWhenAceIs11 += valuesOfSelectedCardsWhenAIs11[i];
      }
      // if any sum is divisible with human card, this means that human can take this cards
      if (sumOfValuesWhenAceIs1 % image.value === 0 || sumOfValuesWhenAceIs11 % image.value === 0) {
        setCardsWhenHumanPlay(selectedCards, cardsWhichIsNotSelected, image);
      } else {
        setCanHumanTakeCards(false);
        setIsOpenModalCanHumanTakeCards(true);
        for (let i = 0; i < selectedCards.length; i++) {
          selectedCards[i].isSelected = !selectedCards[i].isSelected;
        }
        setTableCards([...tableCards]);
      }
    } else {
      humanThrowingCards(image);
    }
  }

  const setCardsWhenHumanPlay = (selectedCards, cardsWhichIsNotSelected, image) => {
    setHumanCards(prevCards => ([...prevCards.filter((img) => img.src !== image.src)]));
    setTableCards(prevCards => ([...prevCards.filter((c) => {
      return cardsWhichIsNotSelected.find((crd => crd.src === c.src));
    })]));
    setHumanCardsTaken([...selectedCards, image, ...humanCardsTaken]);
    const points = serviceGame.getPointsOfCombination(image, selectedCards);
    setHumanPoints((prevPoints) => prevPoints + points);
    if ((humanPoints + points + humanTables) > 100) {
      setIsEndGameModalOpened(true);
    }
    if (selectedCards.length === tableCards.length) {
      setHumanTables(prevState => prevState + 1)
    }
    setIsHumanTurn(false);
    setIsHumanLastThrowing(true);
    setCanHumanTakeCards(true);
  }

  const lastThrowing = () => {
    if (deck.length === 0 && isGameStarted && humanCards.length === 0 && computerCards.length === 0) {
      const points = serviceGame.getCardsPointsSum(tableCards)
      if (isHumanLastThrowing) {
        setHumanCardsTaken(prevValue => [...prevValue, ...tableCards]);
        setHumanPoints((prevPoints) => prevPoints + points)
      } else {
        setComputerCardsTaken(prevValue => [...prevValue, ...tableCards]);
        setComputerPoints((prevPoints) => prevPoints + points)
      }
      setTimeout(() => {
        setIsGameStarted(false);
        setTableCards(() => []);
      }, 500);
    }
  }

  const continueGame = () => {
    closeEndRoundDialog();
    if (computerCardsTaken.length > humanCardsTaken.length) {
      setComputerPoints(prevPoints => prevPoints + 3);
    } else if (humanCardsTaken.length > computerCardsTaken.length) {
      setHumanPoints(prevPoints => prevPoints + 3);
    }
    setHumanCardsTaken([]);
    setComputerCardsTaken([]);
    setIsCardThrown(false);
    CARDS.forEach((card) => {
      card.isSelected = false;
      card.isFliped = false;
    });
    setIsHumanTurn(prevValue =>  !prevValue)
    setTimeout(() => {
      startGame()
    }, 1000)
  }

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (!isGameStarted && ((humanPoints + computerPoints) > 0)) {
      setIsOpenedEndRoundDialog(true);
    }
  }, [isGameStarted]);

  useEffect(() => {
    if (!humanCards.length && !computerCards.length) {
      setTimeout(() => {
        dealCards();
      }, 1000)
    }
    setTimeout(() => {
      lastThrowing();
    }, 1000);
  }, [humanCards, computerCards]);

  useEffect(() => {
    if (!isHumanTurn && computerCards.length === 6) {
      setTimeout(() => {
        computerGame();
      }, 4000)
    }
  }, [computerCards]);

  useEffect(() => {
    setTimeout(() => {
      setIsHumanCardDisabled(!isHumanTurn);
    }, 1000)
    if (!isHumanTurn && !!computerCards.length && !isEndGameModalOpened) {
      setTimeout(() => {
        computerGame();
      }, 1000)
    }
  }, [isHumanTurn]);

  return (
    <div className="section">
      {/* static deck on table */}
      <CardsPile cards={deck} classContainer='deck-cards-container' />
      {/* cards which is human taken - static deck*/}
      {(humanCardsTaken.length !== 0) ?
        <CardsPile cards={humanCardsTaken} classContainer='human-taken-cards-container' /> : 
        <div />
      }
      {/* cards which is computer taken - static deck */}
      {(computerCardsTaken.length !== 0) ?
        <CardsPile cards={computerCardsTaken} classContainer='computer-taken-cards-container' /> :
        <div />
      }
      {/* when one round is finished */}
      <EndRoundModal
        isOpenedEndRoundDialog={isOpenedEndRoundDialog}
        closeEndRoundDialog={closeEndRoundDialog}
        computerCardsTaken={computerCardsTaken}
        humanCardsTaken={humanCardsTaken}
        humanTables={humanTables}
        humanPoints={humanPoints}
        computerTables={computerTables}
        computerPoints={computerPoints}
        continueGame={continueGame}
      />
      {((humanPoints + humanTables) > 100) ?
        <div>
          <InformationModal 
            isOpenModal={isEndGameModalOpened}
            closeModal={closeEndGameModal}
            title="Kraj igre"
            contentText="Čestitamo! Vi ste pobednik!"
          />
        </div> :
        <div>
          {((computerPoints + computerTables) > 100) ?
          <div>
            <InformationModal 
              isOpenModal={isEndGameModalOpened}
              closeModal={closeEndGameModal}
              title="Kraj igre"
              contentText="Nažalost, u ovoj igri je računar pobednik. Više sreće sledeći put!"
            />
          </div> :
          <div />
          }
        </div>
      }
      <div>
        {/* start game */}
        <Result 
          humanPoints={humanPoints}
          humanTables={humanTables}
          computerPoints={computerPoints}
          computerTables={computerTables}
        />
        <div className="main-container">
          {/* human cards */}
          <div className={["human-cards", "cards-container"].filter(e => !!e).join(' ')}>
            {humanCards.map((image, index) =>
              <div key={index} className="card-container" alt="cards" onClick={() => humanPlay(image)}>
                <img
                  src={require('' + CARD_BACKGROUND)}
                  alt="card"
                  className={`
                    ${isGameStarted ? "back-human-card" : "back-card-throw-on-table"}
                    ${(humanCardsTaken.length !== 0) && 'taken-human-cards'}`}>
                </img>
                <img
                  src={require('' + image.src)}
                  alt="card"
                  className={`
                    ${isGameStarted ? "front-human-card" : "front-card-throw-on-table"}`}>
                </img>
              </div>
            )}
          </div>
          {(canHumanTakeCards) ? 
            <div /> :
            <div>
              <InformationModal 
                isOpenModal={isOpenModalCanHumanTakeCards}
                closeModal={closeModalCanHumanTakeCards}
                title="Obaveštenje"
                contentText="Nažalost, ne možete da nosite karte koje ste selektovali na talonu sa Vašom kartom. Molim Vas odigrajte ponovo."
              />
            </div>
          }
          {/* table cards */}
          <div className={["table-cards"].filter(e => !!e).join(' ')}>
            {tableCards.map((image, index) =>
              <div
                key={index}
                onClick={() => toggleCardsOnTable(image)}
                className={[
                  "card-container"
                ].filter(e => !!e).join(' ')} >
                <img
                  src={require('' + CARD_BACKGROUND)}
                  alt="card"
                  className={`
                    ${image.isSelected && 'selected-card'}
                    ${isCardThrown ? 'back-card-throw-on-table' : "back-table-card"}`}>
                </img>
                <img
                  src={require('' + image.src)}
                  alt="card"
                  className={`
                    ${image.isSelected && 'selected-card'}
                    ${isCardThrown ? 'front-card-throw-on-table' : "front-table-card"}`}>
                </img>
              </div>
            )}
          </div>
          {/* computer cards */}
          <div className={["computer-cards", "cards-container"].filter(e => !!e).join(' ')}>
            {computerCards.map((image, index) =>
              <div key={index}>
                {(!image.isFliped) ?
                  <div>
                    <img src={require('' + CARD_BACKGROUND)} className="back-card" alt="card"></img>
                    <img src={require('' + image.src)} className="front-card" alt="card"></img>
                  </div> :
                  <div>
                    <img src={require('' + image.src)} className="front-card-fliped" alt="card"></img>
                  </div>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainGame;
