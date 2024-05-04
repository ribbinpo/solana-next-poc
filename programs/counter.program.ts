import { AnchorProvider, IdlAccounts, Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import { Counter } from "./interfaces/counter";
import IDL from "./idl/counter.json";

// Programs
export const counterProgram = (
  network = WalletAdapterNetwork.Devnet,
  provider?: AnchorProvider
) => {
  const connection = new Connection(clusterApiUrl(network), "confirmed");
  return new Program(
    IDL as Counter,
    provider
      ? provider
      : {
          connection,
        }
  );
};

// Program Derived Addresses
export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  counterProgram().programId
);

// Program Data
export type CounterData = IdlAccounts<Counter>["counter"];

// Build Program Transactions
export const countTransaction = async ({
  network = WalletAdapterNetwork.Devnet,
  provider,
}: {
  network?: WalletAdapterNetwork;
  provider?: AnchorProvider;
}) => {
  const program = counterProgram(network, provider);

  const transaction = await program.methods
    .increment()
    .accounts({
      counter: counterPDA,
    })
    .transaction();
  return transaction;
};
