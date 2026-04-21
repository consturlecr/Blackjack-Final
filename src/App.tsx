import { useState } from 'react';
import { OnchainProviders } from './components/OnchainProviders';
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { useBlackjack } from './hooks/useBlackjack';
import { Hand } from './components/Blackjack/Hand';
import { CheckIn } from './components/CheckIn';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Swords, RefreshCcw, Info } from 'lucide-react';

function BlackjackGame() {
  const { isConnected, address } = useAccount();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { 
    playerHand, 
    dealerHand, 
    status, 
    message, 
    playerScore, 
    dealerScore, 
    startNewGame, 
    hit, 
    stand 
  } = useBlackjack();

  return (
    <div className="relative h-full min-h-screen w-full flex flex-col items-center overflow-hidden table-surface">
      <div className="absolute inset-0 felt-texture"></div>

      {/* Header Info */}
      <header className="w-full h-20 flex items-center justify-between px-10 border-b border-white/5 z-20 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0052FF] rounded-full flex items-center justify-center font-bold text-white text-xl">B</div>
          <h1 className="text-white font-medium tracking-tight text-xl">Base<span className="font-light opacity-50">Jack</span> 21</h1>
        </div>
        
        <div className="flex items-center gap-6">
          {isConnected && (
            <div className="flex flex-col items-end">
              <span className="text-white/40 text-[10px] uppercase tracking-widest leading-none">Status</span>
              <span className="text-white font-mono text-sm">{isCheckedIn ? "Checked In" : "Pending Join"}</span>
            </div>
          )}
          <Wallet>
            <ConnectWallet className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all glowing-border border-0">
              <Name />
            </ConnectWallet>
            <WalletDropdown className="glass">
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
              </Identity>
              <WalletDropdownDisconnect className="hover:bg-rose-500/10 text-rose-400" />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="relative flex-1 w-full flex flex-col justify-center items-center z-10 py-12 px-6">
        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center max-w-lg w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#0052FF]/20 flex items-center justify-center mb-8">
                <Swords className="w-10 h-10 text-[#0052FF]" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Connect to Play</h2>
              <p className="text-white/50 mb-8">Connect your wallet to join the Base table and start your streak on the Base network.</p>
              <Wallet>
                <ConnectWallet className="bg-[#0052FF] hover:brightness-110 text-white font-bold py-4 px-10 rounded-full shadow-[0_0_30px_rgba(0,82,255,0.3)] transition-all" />
              </Wallet>
            </motion.div>
          ) : !isCheckedIn ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center max-w-lg w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-12 text-center"
            >
              <h2 className="text-4xl font-bold mb-4 uppercase tracking-tighter">Identity Check-in</h2>
              <p className="text-white/50 mb-10">Perform a gas-only check-in to confirm your seat at the table. This is free, you only pay network gas.</p>
              <CheckIn onComplete={() => setIsCheckedIn(true)} />
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              {status === 'betting' ? (
                <div className="flex flex-col items-center justify-center h-[400px] gap-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startNewGame}
                    className="bg-white text-black font-black text-3xl px-16 py-6 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all uppercase tracking-tighter"
                  >
                    Deal Cards
                  </motion.button>
                  <div className="flex items-center gap-2 text-white/30 text-xs tracking-widest font-mono uppercase">
                    <Info className="w-3 h-3" /> Dealer stands on 17
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-16 w-full max-w-4xl">
                  {/* Dealer Hand */}
                  <div className="flex flex-col items-center gap-6">
                    <Hand 
                      title="Dealer" 
                      cards={dealerHand} 
                      score={dealerScore} 
                      hideSecondCard={status === 'playing'} 
                    />
                  </div>

                  {/* Message Overlay */}
                  <div className="h-12 flex items-center justify-center">
                    <AnimatePresence>
                      {message && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="px-8 py-3 rounded-full bg-[#0052FF] text-white font-bold text-xl shadow-[0_0_30px_rgba(0,82,255,0.4)] uppercase tracking-tight"
                        >
                          {message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Player Hand */}
                  <div className="flex flex-col items-center gap-10">
                    <Hand title="You" cards={playerHand} score={playerScore} />
                    
                    <div className="flex gap-4">
                      {status === 'playing' ? (
                        <>
                          <button 
                            onClick={hit} 
                            className="w-32 h-14 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-xl font-bold transition-all uppercase text-sm tracking-widest"
                          >
                            Hit
                          </button>
                          <button 
                            onClick={stand} 
                            className="w-32 h-14 bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-xl font-bold transition-all uppercase text-sm tracking-widest"
                          >
                            Stand
                          </button>
                        </>
                      ) : status === 'resolved' && (
                        <button 
                          onClick={startNewGame} 
                          className="w-48 h-14 bg-[#0052FF] text-white rounded-xl font-bold shadow-[0_0_30px_rgba(0,82,255,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                        >
                          <RefreshCcw className="w-4 h-4" /> Next Round
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sidebar - Daily Rewards / Stats */}
      {isConnected && (
        <aside className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-64 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl z-30">
          <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Network Status
          </h2>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-6 text-center">
            <div className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Check-in Reward</div>
            <div className="text-white font-bold text-xl mb-3">100 CHIPS</div>
            <button 
              disabled={!isCheckedIn}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${isCheckedIn ? 'bg-[#0052FF] hover:brightness-110 text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
            >
              {isCheckedIn ? 'CLAIMED' : 'CLAIM NOW'}
            </button>
            <p className="text-[9px] text-white/30 mt-2 uppercase tracking-tighter">Pay gas only (Base Network)</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs items-center">
              <span className="text-white/40 uppercase tracking-widest">Player</span>
              <span className="text-white font-mono truncate max-w-[100px]">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-white/40 uppercase tracking-widest">Network</span>
              <span className="text-blue-400 font-bold">BASE</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-white/40 uppercase tracking-widest">Provably Fair</span>
              <span className="text-green-400">Verified</span>
            </div>
          </div>
        </aside>
      )}

      {/* Footer Details */}
      <div className="absolute bottom-6 left-8 flex items-center gap-6 text-white/20 text-[10px] uppercase tracking-[0.2em] z-20">
        <span>Terms of Service</span>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <span>Provably Fair</span>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <span>Base Chain Native</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OnchainProviders>
      <BlackjackGame />
    </OnchainProviders>
  );
}
