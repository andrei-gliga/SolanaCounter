import { IdlAccounts, Program, AnchorProvider, setProvider, Idl } from "@coral-xyz/anchor";
import idl from "./idl.json";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import {Counter} from "./counter.ts";

export const useSetup = () => {
  // const programId = idl.address;
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const wallet = useAnchorWallet();
  if (!wallet) {
    return null;
  }
  const provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);

  // Initialize the program interface with the IDL, program ID, and connection.
  const program = new Program<Counter>(
    idl,
    provider
  );

  const [counterPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    program.programId,
  );

  return {program, counterPDA};
}

// This is just a TypeScript type for the Counter data structure based on the IDL
// We need this so TypeScript doesn't yell at us
export type CounterData = IdlAccounts<Counter>["counter"];

