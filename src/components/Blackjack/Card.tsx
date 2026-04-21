import { motion } from 'motion/react';
import { Card as CardType } from '../../hooks/useBlackjack';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  card: CardType;
  hidden?: boolean;
}

export function Card({ card, hidden }: CardProps) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20, rotateY: 90 }}
      animate={{ scale: 1, opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.4, type: 'spring' }}
      className={twMerge(
        "relative w-24 h-36 rounded-xl card-shadow flex flex-col justify-between p-3 border transition-all duration-300",
        hidden 
          ? "bg-[#1a1a1a] border-white/10" 
          : "bg-white border-white/10"
      )}
    >
      {hidden ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/5 font-bold text-4xl">?</span>
        </div>
      ) : (
        <>
          <div className={clsx("flex flex-col items-start gap-0.5 leading-none", isRed ? "text-red-600" : "text-black")}>
            <span className="font-bold text-lg">{card.rank}</span>
            <span className="text-lg">{getSuitSymbol(card.suit)}</span>
          </div>
          
          <div className={clsx("absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none", isRed ? "text-red-600" : "text-black")}>
            <span className="text-6xl">{getSuitSymbol(card.suit)}</span>
          </div>

          <div className={clsx("flex flex-col items-start gap-0.5 leading-none rotate-180 self-end", isRed ? "text-red-600" : "text-black")}>
            <span className="font-bold text-lg">{card.rank}</span>
            <span className="text-lg">{getSuitSymbol(card.suit)}</span>
          </div>
        </>
      )}
    </motion.div>
  );
}
