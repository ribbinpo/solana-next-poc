import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { create } from "zustand";

interface IUserSOLBalanceStore {
  balance: number;
  getUserSOLBalance: (publicKey: PublicKey, connection: Connection) => void;
}

export const useUserSOLBalanceStore = create<IUserSOLBalanceStore>((set) => ({
  balance: 0,
  getUserSOLBalance: async (publicKey, connection) => {
    let balance = 0;
    try {
      balance = await connection.getBalance(publicKey);
      balance = balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error(error);
    }

    set({ balance });
    console.log("Balance: ", balance);
  }
}));

