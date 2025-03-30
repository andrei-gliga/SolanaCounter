import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { Keypair, PublicKey } from "@solana/web3.js";

describe("counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;

  // Generate a new keypair to use as the address the counter account

  const [counterPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")], // This is the seed -- just the string "counter"
    program.programId, // If we're interacting with the program, we know its ID
  );

  it("Is initialized!", async () => {
    // Invoke the initialize instruction
    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        counter: counterPDA,
      })
      .rpc();

    // Fetch the counter account data
    const accountData = await program.account.counter.fetch(
      counterPDA,
    );

    console.log(`Transaction Signature: ${transactionSignature}`);
    console.log(`Count: ${accountData.count}`);
  });

  it("Increment", async () => {
    // Invoke the increment instruction
    const transactionSignature = await program.methods
      .increment()
      .accounts({
        counter: counterPDA,
      })
      .rpc();

    // Fetch the counter account data
    const accountData = await program.account.counter.fetch(
      counterPDA,
    );

    console.log(`Transaction Signature: ${transactionSignature}`);
    console.log(`Count: ${accountData.count}`);
  });
});