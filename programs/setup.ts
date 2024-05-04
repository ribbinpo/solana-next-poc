import { IdlAccounts, Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import { Counter } from "./idl/counter";
import IDL from "./idl/counter.json";
 
const programId = new PublicKey(IDL.address);
const connection = new Connection(clusterApiUrl(WalletAdapterNetwork.Testnet), "confirmed"); // fix

export const program = new Program(IDL as Counter, {
  connection,
});
 
export const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  programId,
);
 
export type CounterData = IdlAccounts<Counter>["counter"];