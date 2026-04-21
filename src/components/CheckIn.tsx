import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus, 
  TransactionStatusLabel, 
  TransactionStatusAction 
} from '@coinbase/onchainkit/transaction';
import type { TransactionResponseType } from '@coinbase/onchainkit/transaction';
import { useAccount } from 'wagmi';
import { encodeFunctionData } from 'viem';

// The deployed contract address on Base
const CONTRACT_ADDRESS = '0x4F09939e095C9563824D687CC5c5a5bB8D2cd719';

// Builder code bc_wb8tf3zc converted to 8-byte hex suffix
// Reference: https://docs.base.org/base-chain/builder-codes/builder-codes
// wb8tf3zc -> 77 62 38 74 66 33 7a 63
const BUILDER_CODE_SUFFIX = '7762387466337a63';

const ABI = [
  {
    name: 'checkIn',
    type: 'function',
    stateMutability: 'external',
    inputs: [{ name: 'message', type: 'string' }],
    outputs: [],
  },
] as const;

export function CheckIn({ onComplete }: { onComplete: () => void }) {
  const { address } = useAccount();
  const [isVerified, setIsVerified] = useState(false);

  if (!address) return null;

  // Encode function call
  const callData = encodeFunctionData({
    abi: ABI,
    functionName: 'checkIn',
    args: ['Base Blackjack 21 Player'],
  });

  // Append the builder code hex at the end of the data field
  const finalData = `${callData}${BUILDER_CODE_SUFFIX}` as `0x${string}`;

  const calls = [
    {
      to: CONTRACT_ADDRESS as `0x${string}`,
      data: finalData
    }
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatePresence>
        {!isVerified ? (
          <Transaction
            calls={calls}
            onSuccess={(response: TransactionResponseType) => {
              console.log('Transaction success', response);
              setIsVerified(true);
              setTimeout(() => onComplete(), 2000);
            }}
            onError={(error) => {
              console.error('Transaction error', error);
            }}
          >
            <TransactionButton 
              className="bg-[#0052FF] hover:brightness-110 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(0,82,255,0.4)] transition-all transform hover:scale-105 uppercase tracking-widest text-sm"
              text="Sit at the Table" 
            />
            <TransactionStatus>
              <TransactionStatusLabel />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-400 font-bold flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-2xl">✓</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                VERIFIED ON-CHAIN
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] text-center mt-2">
        Gas-only join (Base Network)
      </p>
    </div>
  );
}
