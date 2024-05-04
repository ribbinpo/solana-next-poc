import { useCallback, useEffect, useState } from "react";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connection, Commitment, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import idl from "@/programs/idl/counter.json";
import { Counter } from "@/programs/idl/counter";
import { CounterData, counterPDA } from "@/programs/setup";

const CounterPage = () => {
  const wallet = useAnchorWallet();
  const { connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [counterData, setCounterData] = useState<CounterData | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const opts = { preflightCommitment: "processed" as Commitment };
  const getProvider = useCallback(() => {
    if (!wallet) return null;
    const connection = new Connection(
      clusterApiUrl(WalletAdapterNetwork.Devnet),
      opts.preflightCommitment
    );
    return new AnchorProvider(connection, wallet, opts);
  }, [opts, wallet]);

  const increase = async () => {
    if (!connected) {
      return;
    }
    const provider = getProvider();
    if (!provider) {
      return;
    }
    const program = new Program<Counter>(idl as Counter, provider);

    try {
      const t = await program.methods
        .increment()
        .accounts({
          counter: counterPDA,
        })
        .transaction();
      const transactionR = await sendTransaction(t, connection, opts);
      console.log("Transaction sent:", transactionR);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const provider = getProvider();
    if (!provider) {
      return;
    }
    const program = new Program<Counter>(idl as Counter, provider);

    program.account.counter.fetch(counterPDA).then((data) => {
      setCounterData(data);
    });
    const subscriptionId = connection?.onAccountChange(
      counterPDA,
      (accountInfo) => {
        setCounterData(
          program.coder.accounts.decode("counter", accountInfo.data)
        );
      }
    );
    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [connection, getProvider]);

  return (
    <div>
      <button onClick={increase}>Add</button>
      <p className="text-lg">Count: {counterData?.count?.toString()}</p>
    </div>
  );
};

export default CounterPage;
