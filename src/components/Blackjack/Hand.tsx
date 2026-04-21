import { Card as CardType } from '../../hooks/useBlackjack';
import { Card } from './Card';
import { twMerge } from 'tailwind-merge';

interface HandProps {
  cards: CardType[];
  title: string;
  score: number;
  hideSecondCard?: boolean;
}

export function Hand({ cards, title, score, hideSecondCard }: HandProps) {
  const isDealer = title.toLowerCase() === 'dealer';
  
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-white/30 text-xs uppercase tracking-[0.2em]">
        {title}
      </div>
      
      <div className="flex justify-center -space-x-12 px-6">
        {cards.map((card, index) => (
          <div key={`${card.rank}-${card.suit}-${index}`} style={{ zIndex: index }}>
            <Card card={card} hidden={hideSecondCard && index === 1} />
          </div>
        ))}
        {cards.length === 0 && (
           <div className="w-24 h-36 rounded-xl border border-dashed border-white/20 flex items-center justify-center bg-black/20">
              <span className="text-white/5 text-4xl font-bold">?</span>
           </div>
        )}
      </div>

      <div className={twMerge(
        "transition-all duration-500",
        isDealer 
          ? "bg-black/40 px-3 py-1 rounded text-white/50 text-xs" 
          : "bg-[#0052FF]/20 border border-[#0052FF]/40 px-6 py-2 rounded-full text-white text-sm font-semibold tracking-widest"
      )}>
        {isDealer ? "DEALER" : "YOU"}: {hideSecondCard ? '?' : score}
      </div>
    </div>
  );
}
