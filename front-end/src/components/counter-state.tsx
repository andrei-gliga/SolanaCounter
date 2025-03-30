import { useCallback, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useSetup, CounterData } from "../anchor/setup";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import IncrementButton from "./increment-button";

export default function CounterState() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [counterData, setCounterData] = useState<CounterData | null>(null);

  const setup = useSetup();

  const fetchCounterData = useCallback(async () => {
    if (!setup) return;

    const { program, counterPDA } = setup;

    try {
      const data = await program.account.counter.fetch(counterPDA);
      setCounterData(data);
    } catch (error) {
      console.error("Error fetching counter data:", error);
    }
  }, [setup]);
  
  useEffect(() => {
    fetchCounterData();

    if (!setup) return;

    const { program, counterPDA } = setup;

    const subscriptionId = connection.onAccountChange(counterPDA, (accountInfo) => {
      try {
        const decodedData = program.coder.accounts.decode("counter", accountInfo.data);
        setCounterData(decodedData);
      } catch (error) {
        console.error("Error decoding account data:", error);
      }
    });

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [setup, connection, fetchCounterData]);

  if (!wallet) {
    return (
      <div>
        <p>Please connect your wallet to view the counter.</p>
        <WalletMultiButton />
      </div>
    );
  }

  if (!setup) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Count: {counterData?.count?.toString()}</p>
      {/* Pass the refreshCounter function to IncrementButton */}
      <IncrementButton onTransactionComplete={fetchCounterData} />
    </div>
  );
}