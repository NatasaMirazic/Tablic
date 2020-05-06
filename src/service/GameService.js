class GameService {

  getShuffledCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  getCardWithMinValue(computerCards) {
    var minValueCard = computerCards[0];
    for (let i = 0; i < computerCards.length; i++) {
      if (computerCards[i].value < minValueCard.value) {
        minValueCard = computerCards[i];
      }
    }
    return minValueCard;
  }

  getCombinationsWithMaxPoints(allCombinations) {
    var combinationWithMaxPoints = allCombinations[0].points;
    for (let i = 0; i < allCombinations.length; i++) {
      if (allCombinations[i].points > combinationWithMaxPoints) {
        combinationWithMaxPoints = allCombinations[i].points;
      }
    }
    return allCombinations.filter((cards) => cards.points === combinationWithMaxPoints);
  }

  getCombinationsWithMaxNumberOfCards(allCombinationsWithMaxPoints) {
    if (allCombinationsWithMaxPoints.length <= 1) {
      return [];
    }
    var combinationWithMaxNumberOfCards = allCombinationsWithMaxPoints[0].total;
    for (let i = 0; i < allCombinationsWithMaxPoints.length; i++) {
      if (allCombinationsWithMaxPoints[i].total > combinationWithMaxNumberOfCards) {
        combinationWithMaxNumberOfCards = allCombinationsWithMaxPoints[i].total;
      }
    }
    return allCombinationsWithMaxPoints.filter((cards) => cards.total === combinationWithMaxNumberOfCards);
  }

  getCombinationsWithAce(tableCards) {
    var newTableCards = [];
    for (let i = 0; i < tableCards.length; i++) {
      // if table card is ace
      if (Array.isArray(tableCards[i].value)) {
        // push first value of ace ie. 1 in newTableCards
        newTableCards.push({
          ...tableCards[i],
          value: tableCards[i].value[0],
          originalCard: tableCards[i]
        });
        // push first value of ace ie. 11 in newTableCards
        newTableCards.push({
          ...tableCards[i],
          value: tableCards[i].value[1],
          originalCard: tableCards[i]
        });
        // push other cards in newTableCards
      } else {
        newTableCards.push(tableCards[i]);
      }
    }
    return newTableCards;
  }

  getCombinationsForSameValueCards(cardsSet, card) {
    var combinations = [];
    for (let i = 0; i < cardsSet.length; i++) {
      if (cardsSet[i].value % card.value === 0) {
        combinations.push({
          card: card,
          cards: [cardsSet[i]],
          points: card.points + cardsSet[i].points,
          total: 2
        })
      }
    }
    return combinations;
  }

  getAllCombinations(cardsSet, card) {
    // make array of each elements which sum is less than card value
    for (let i = 0; i < cardsSet.length; i++) {
      for (let j = i+1; j < cardsSet.length; j++) {
        if (
          (cardsSet[i].value + cardsSet[j].value) <= card.value) {
          cardsSet.push([cardsSet[i], cardsSet[j]]);
        }
        for (let k = j+1; k < cardsSet.length; k++) {
          if (
            (cardsSet[i].value + cardsSet[j].value + cardsSet[k].value) <= card.value) {
            cardsSet.push([cardsSet[i], cardsSet[j], cardsSet[k]]);
          }
          for (let l = k+1; l < cardsSet.length; l++) {
            if ((cardsSet[i].value + cardsSet[j].value + cardsSet[k].value + cardsSet[l].value) <= card.value) {
              cardsSet.push([cardsSet[i], cardsSet[j], cardsSet[k], cardsSet[l]]);
            }
          }
        }
      }
    }
    return cardsSet;
  }

  getCombinationsWithEqualSumAsCard(cardsSet, combinations, card) {
    // put all elements in array and sum them
    for (let i = 0; i < cardsSet.length; i++) {
      const iCards = Array.isArray(cardsSet[i]) ? cardsSet[i] : [cardsSet[i]];
      const iSum = Array.isArray(cardsSet[i]) ? cardsSet[i].reduce((a,b) => a.value + b.value) : cardsSet[i].value;
      for (let j = i+1; j < cardsSet.length; j++) {
        const jCards = Array.isArray(cardsSet[j]) ? cardsSet[j] : [cardsSet[j]];
        const jSum = Array.isArray(cardsSet[j]) ? cardsSet[j].reduce((a,b) => a.value + b.value) : cardsSet[j].value;
        const cards = [...iCards, ...jCards];
        var points = this.getCardsPointsSum(cards);
        const isUnique = this.areCardsIdsUnique(cards);
        // if their sum is equal as card value, push these elements in combinations
        if (isUnique && ((iSum + jSum) % card.value === 0)) {
          combinations.push({
            card,
            cards,
            points: card.points + points,
            total: cards.length + 1
          });
        }
      }
    }
    return combinations;
  }

  getCardsPointsSum(cards) {
    var points = 0;
    for (let i = 0; i < cards.length; i++) {
      points += cards[i].points;
    }
    return points;
  }

  areCardsIdsUnique(cards) {
    const cardsIds = cards.map((card) => {
      return card.id;
    })
    return cardsIds.length === new Set(cardsIds).size;
  }

  getValuesOfSelectedCards(selectedCards, valuesOfSelectedCardsWhenAceIs1, valuesOfSelectedCardsWhenAceIs11) {
    for (let i = 0; i < selectedCards.length; i++) {
      if (this.isCardAce(selectedCards[i])) {
        valuesOfSelectedCardsWhenAceIs1.push(1);
        valuesOfSelectedCardsWhenAceIs11.push(11);
      } else {
        valuesOfSelectedCardsWhenAceIs11.push(selectedCards[i].value);
        valuesOfSelectedCardsWhenAceIs1.push(selectedCards[i].value);
      }
    }
  }

  isCardAce(card) {
    return card.src.includes("A");
  }

  getPointsOfCombination(card, combinations) {
    var points = card.points;
    for (let i = 0; i < combinations.length; i++) {
      points += combinations[i].points;
    }
    return points
  }
}

export default GameService;
