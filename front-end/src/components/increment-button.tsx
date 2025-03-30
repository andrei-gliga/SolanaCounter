import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useSetup } from "../anchor/setup";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function IncrementButton({ onTransactionComplete }: { onTransactionComplete: () => void }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const setup = useSetup();

  const onClick = async () => {
    if (!publicKey || !setup) return;

    setIsLoading(true);

    try {
      const { program, counterPDA } = setup;

      // Create a transaction to invoke the increment function
      const transaction = await program.methods
        .increment()
        .accounts({
          counter: counterPDA,
        })
        .transaction();

      const transactionSignature = await sendTransaction(transaction, connection);

      console.log(
        `View on explorer: https://solana.fm/tx/${transactionSignature}?cluster=devnet-alpha`,
      );

      // Call the callback function to refresh the counter state
      onTransactionComplete();
    } catch (error) {
      console.error("Error incrementing counter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div>
        <p>Please connect your wallet to increment the counter.</p>
        <WalletMultiButton />
      </div>
    );
  }

  if (!setup) {
    return <p>Loading...</p>;
  }

  return (
    <button className="w-24" onClick={onClick} disabled={isLoading}>
      {isLoading ? "Loading..." : "Increment"}
    </button>
  );
}