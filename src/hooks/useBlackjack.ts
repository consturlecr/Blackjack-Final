import { useState, useCallback, useEffect } from 'react';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type GameStatus = 'betting' | 'playing' | 'dealer-turn' | 'resolved';

export function useBlackjack() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [status, setStatus] = useState<GameStatus>('betting');
  const [message, setMessage] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);

  const calculateScore = (hand: Card[]) => {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.rank === 'A') {
        aces += 1;
        score += 11;
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        score += 10;
      } else {
        score += parseInt(card.rank);
      }
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    return score;
  };

  const createDeck = () => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const newDeck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push({ suit, rank });
      }
    }

    return newDeck.sort(() => Math.random() - 0.5);
  };

  const startNewGame = useCallback(() => {
    const newDeck = createDeck();
    const p1 = newDeck.pop()!;
    const d1 = newDeck.pop()!;
    const p2 = newDeck.pop()!;
    const d2 = newDeck.pop()!;

    setDeck(newDeck);
    setPlayerHand([p1, p2]);
    setDealerHand([d1, d2]);
    setStatus('playing');
    setMessage('');
  }, []);

  const hit = () => {
    if (status !== 'playing') return;

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];

    setDeck(newDeck);
    setPlayerHand(newHand);

    const score = calculateScore(newHand);
    if (score > 21) {
      setStatus('resolved');
      setMessage('Bust! Dealer wins.');
    }
  };

  const stand = () => {
    if (status !== 'playing') return;
    setStatus('dealer-turn');
  };

  useEffect(() => {
    setPlayerScore(calculateScore(playerHand));
    setDealerScore(calculateScore(dealerHand));
  }, [playerHand, dealerHand]);

  useEffect(() => {
    if (status === 'dealer-turn') {
      let currentDealerHand = [...dealerHand];
      let currentDeck = [...deck];

      const interval = setInterval(() => {
        const score = calculateScore(currentDealerHand);
        if (score < 17) {
          const card = currentDeck.pop()!;
          currentDealerHand = [...currentDealerHand, card];
          setDealerHand(currentDealerHand);
          setDeck(currentDeck);
        } else {
          clearInterval(interval);
          resolveGame(score);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [status]);

  const resolveGame = (finalDealerScore: number) => {
    const pScore = calculateScore(playerHand);
    const dScore = finalDealerScore;

    if (dScore > 21) {
      setMessage('Dealer busts! You win!');
    } else if (pScore > dScore) {
      setMessage('You win!');
    } else if (pScore < dScore) {
      setMessage('Dealer wins.');
    } else {
      setMessage('Push (Draw).');
    }
    setStatus('resolved');
  };

  return {
    playerHand,
    dealerHand,
    status,
    message,
    playerScore,
    dealerScore,
    startNewGame,
    hit,
    stand
  };
}
