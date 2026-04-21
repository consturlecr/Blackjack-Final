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

// Builder code bc_sejg61hm converted to 8-byte hex suffix
// Reference: https://docs.base.org/base-chain/builder-codes/builder-codes
// sjeg61hm -> 73 65 6a 67 36 31 68 6d
const BUILDER_CODE_SUFFIX = '73656a673631686d';

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
      <Transaction
        calls={calls}
        onSuccess={(response: TransactionResponseType) => {
          console.log('Transaction success', response);
          onComplete();
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
      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] text-center">
        Gas-only join (Base Network)
      </p>
    </div>
  );
}
