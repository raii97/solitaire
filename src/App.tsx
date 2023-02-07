import { useEffect, useState } from "react";
import "./App.css";
import CardComponent from "./components/card/card";
import { Card } from "./types";
import { Learning } from "./components/learning/learning";
import { getByLabelText } from "@testing-library/react";

function App() {
  const [deck, setDeck] = useState<Array<Card>>([]);
  const [dealtCards, setDealtCards] = useState<Array<Array<Card>>>([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [selectedDealtCard, setSelectedDealtCard] = useState<boolean>(false);
  const [selectedDeckCard, setSelectedDeckCard] = useState<boolean>(false);
  const [aces, setAces] = useState<Array<Array<Card>>>([[], [], [], []]);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [hasGameStarted, setHasGameStarted] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  const makeDeck = () => {
    const deck: Array<Card> = [];
    const suits = ["spade", "diamond", "club", "heart"];
    suits.forEach((suit) => {
      const color = suit === "spade" || suit === "club" ? "black" : "red";
      for (let i = 1; i < 14; i++) {
        let newCard = {
          suit,
          color,
          number: i,
          flipped: false,
          selected: false,
        };
        deck.push(newCard);
      }
    });

    return deck;
  };

  const shuffleDeck = (deck: Array<Card>) => {
    let shuffledDeck = [];
    for (let index = 0; index < 52; index++) {
      let randomNumber = Math.floor(Math.random() * deck.length);
      let removeCard = deck.splice(randomNumber, 1);
      shuffledDeck.push(...removeCard);
    }

    return shuffledDeck;
  };

  const dealDeck = (deck: Array<Card>) => {
    const dCards: Array<Array<Card>> = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
      const removeCard: any = deck.splice(0, i + 1);
      removeCard[removeCard.length - 1].flipped = true;
      dCards[i].push(...removeCard);
    }

    return dCards;
  };

  const startGame = () => {
    const deck = makeDeck();
    const shuffledDeck = shuffleDeck(deck);
    const dCards = dealDeck(shuffledDeck);

    shuffledDeck.forEach((card) => {
      card.flipped = true;
    });

    setDealtCards(dCards);
    setDeck(shuffledDeck);
  };

  const nextCard = () => {
    const newDeck = [...deck];
    newDeck[deckIndex].selected = false;
    setDeck(newDeck);

    if (deckIndex === deck.length - 1) {
      setDeckIndex(0);
    } else {
      setDeckIndex(deckIndex + 1);
    }
  };

  const handleDeckClick = () => {
    //reset all cards so selected is false for deck
    const newDeck = [...deck];
    const dCards = [...dealtCards];
    const isDeckCardSelected = newDeck[deckIndex].selected;

    dCards.forEach((col) => {
      col.forEach((card) => {
        card.selected = false;
      });
    });
    setDealtCards(dCards);
    setSelectedDealtCard(false);

    if (isDeckCardSelected) {
      setSelectedDeckCard(false);
      newDeck[deckIndex].selected = false;
    } else {
      setSelectedDeckCard(true);
      newDeck[deckIndex].selected = true;
    }
    setDeck(newDeck);
  };

  const handleDealtCardClick = (colIndex: number, rowIndex: number) => {
    const dCards = [...dealtCards];
    const newDeck = [...deck];

    // checks if card is selected in dealt or deck
    if (selectedDealtCard || selectedDeckCard) {
      //checks if card is selected from the dealtcards
      if (selectedDealtCard) {
        let { card, selectedCol, selectedRow } =
          getCurrentlySelectedDealtCard();

        let currentCard = dCards[colIndex][rowIndex];
        // if card can be moved based on color and number
        if (
          card.color !== currentCard.color &&
          currentCard.number - card.number === 1
        ) {
          const numOfCardsRemoved = dCards[selectedCol!].length - selectedRow!;
          const removedPrevCard = dCards[selectedCol!].splice(
            selectedRow!,
            numOfCardsRemoved
          );
          const prevColLength = dCards[selectedCol!].length;
          if (prevColLength) {
            dCards[selectedCol!][prevColLength - 1].flipped = true;
          }

          dCards[colIndex].push(...removedPrevCard);
          dCards.forEach((col) => {
            col.forEach((card) => {
              card.selected = false;
            });
          });
          incrementMoveCounter();
          setSelectedDealtCard(false);

          // if card cant be moved
        } else {
          dCards.forEach((col) => {
            col.forEach((card) => {
              card.selected = false;
            });
          });
          setSelectedDealtCard(false);
        }

        // exists a selected card in the deck
      } else if (selectedDeckCard) {
        let prevCard = newDeck[deckIndex];
        let currentCard = dCards[colIndex][rowIndex];
        // if card can be moved
        if (
          prevCard.color !== currentCard.color &&
          currentCard.number - prevCard.number === 1
        ) {
          newDeck[deckIndex].selected = false;
          const removeCard = newDeck.splice(deckIndex, 1);
          dCards[colIndex].push(...removeCard);
          if (newDeck.length === deckIndex) {
            setDeckIndex(deckIndex - 1);
          }

          setSelectedDeckCard(false);
          incrementMoveCounter();
        } else {
          newDeck[deckIndex].selected = false;
          setSelectedDeckCard(false);
        }
      }
    } else {
      dCards[colIndex][rowIndex].selected = true;
      setSelectedDealtCard(true);
    }

    setDealtCards(dCards);
    setDeck(newDeck);
  };

  const handleEmptyColClick = (colIndex: number) => {
    const dCards = [...dealtCards];
    const newDeck = [...deck];

    if (selectedDealtCard) {
      let { card, selectedCol, selectedRow } = getCurrentlySelectedDealtCard();
      if (card.number === 13) {
        const numOfCardsRemoved = dCards[selectedCol!].length - selectedRow!;
        const kingCard = dCards[selectedCol!].splice(
          selectedRow!,
          numOfCardsRemoved
        );
        const prevColLength = dCards[selectedCol!].length;
        if (prevColLength) {
          dCards[selectedCol!][prevColLength - 1].flipped = true;
        }
        dCards[colIndex].push(...kingCard);
        setDealtCards(dCards);
      }
    } else if (selectedDeckCard) {
      const card = newDeck[deckIndex];
      if (card.number === 13) {
        const kingCard = newDeck.splice(deckIndex, 1);
        if (deckIndex === newDeck.length) {
          setDeckIndex(deckIndex - 1);
        }
        dCards[colIndex].push(...kingCard);
        setDeck(newDeck);
        setDealtCards(dealtCards);
      }
    } else {
      alert("not a valid move");
    }
  };

  const getCurrentlySelectedDealtCard = () => {
    let selectedCol: number;
    let selectedRow: number;
    dealtCards.forEach((col, colIndex) => {
      col.forEach((card, rowindex) => {
        if (card.selected) {
          selectedCol = colIndex;
          selectedRow = rowindex;
        }
      });
    });
    const card = dealtCards[selectedCol!][selectedRow!];
    return {
      card,
      selectedCol: selectedCol!,
      selectedRow: selectedRow!,
    };
  };

  const handleAceClick = (index: number) => {
    const dCards = [...dealtCards];
    const newDeck = [...deck];
    const newAces = [...aces];

    if (selectedDealtCard) {
      let { card, selectedCol, selectedRow } = getCurrentlySelectedDealtCard();
      if (dCards[selectedCol].length - 1 === selectedRow) {
        let moveDealtCard = () => {
          card.selected = false;
          const cardRemoved = dCards[selectedCol!].splice(selectedRow!, 1);
          newAces[index].push(...cardRemoved);
          const prevColLength = dCards[selectedCol!].length;
          if (prevColLength) {
            dCards[selectedCol!][prevColLength - 1].flipped = true;
          }
          setAces(newAces);
          setDealtCards(dCards);
          setSelectedDealtCard(false);
          incrementMoveCounter();
        };

        if (newAces[index].length === 0) {
          if (card.number === 1) {
            moveDealtCard();
          }
        } else {
          const lastCardIndex = aces[index].length - 1;
          const topOfAceCard = aces[index][lastCardIndex];
          if (
            card.suit === topOfAceCard.suit &&
            card.number === topOfAceCard.number + 1
          ) {
            moveDealtCard();
          }
        }
      }
    } else if (selectedDeckCard) {
      let moveDeckCard = () => {
        card.selected = false;
        const cardRemoved = newDeck.splice(deckIndex, 1);
        newAces[index].push(...cardRemoved);
        if (newDeck.length === deckIndex) {
          setDeckIndex(deckIndex - 1);
        }

        setAces(newAces);
        setSelectedDeckCard(false);
        setDeck(newDeck);
        incrementMoveCounter();
      };
      const card = newDeck[deckIndex];
      if (newAces[index].length === 0) {
        if (card.number === 1) {
          moveDeckCard();
        }
      } else {
        const lastCardIndex = aces[index].length - 1;
        const topOfAceCard = aces[index][lastCardIndex];
        if (
          card.suit === topOfAceCard.suit &&
          card.number === topOfAceCard.number + 1
        ) {
          moveDeckCard();
        }
      }
    }
  };

  const incrementMoveCounter = () => {
    setMoveCount(moveCount + 1);
  };

  const checkGameOver = () => {
    let gameOver = true;
    for (let index = 0; index < aces.length; index++) {
      gameOver = gameOver && aces[index].length === 13;
    }
    return gameOver;
  };

  const handleResetGame = () => {
    startGame();
    setAces([[], [], [], []]);
    setDeckIndex(0);
    setMoveCount(0);
    setSelectedDealtCard(false);
    setSelectedDeckCard(false);
    setTime(0);
  };

  const handleStartGame = () => {
    setHasGameStarted(true);
    setTime(0);
  };

  // return (
  //   <div>
  //     {breeds.map((breed: any) => {
  //       return (
  //         <div>
  //           <div> {breed.breed}</div>
  //         </div>
  //       );
  //     })}
  //   </div>
  if (!hasGameStarted) {
    return (
      <div className="start">
        <button onClick={handleStartGame} className="restart-btn start-game">
          START GAME
        </button>
      </div>
    );
  }

  if (checkGameOver()) {
    return (
      <div>
        <h1>GAME OVER</h1>
        <button onClick={handleResetGame} className="restart-btn">
          Restart Game
        </button>
      </div>
    );
  }

  return (
    <div className="solitaire-app">
      <div className="game-controls">
        <div className="moves"> Moves: {moveCount} </div>
        <p className="moves">Time: {time} seconds</p>
        <button onClick={handleResetGame} className="restart-btn">
          Restart Game
        </button>
      </div>

      <div className="top-box">
        <div className="aces-box">
          {aces.map((aceCol, index) => {
            return (
              <div
                className="ace-column column"
                onClick={() => {
                  handleAceClick(index);
                }}
              >
                {aceCol.length > 0 && (
                  <CardComponent card={aceCol[aceCol.length - 1]} />
                )}
              </div>
            );
          })}
        </div>

        <div className="deck-box">
          <div className="column">
            <CardComponent
              card={deck[deckIndex]}
              handleClick={handleDeckClick}
            />
          </div>

          <div className="card-placeholder column" onClick={nextCard}></div>
        </div>
      </div>
      <div className="dealt-cards">
        {dealtCards.map((column, colIndex) => {
          if (column.length === 0) {
            return (
              <div
                className="column empty-col"
                onClick={() => {
                  handleEmptyColClick(colIndex);
                }}
              ></div>
            );
          }
          return (
            <div className="column">
              {column.map((card, rowIndex) => {
                return (
                  <CardComponent
                    card={card}
                    handleClick={handleDealtCardClick}
                    colIndex={colIndex}
                    rowIndex={rowIndex}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
