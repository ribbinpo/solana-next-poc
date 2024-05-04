import { useCallback } from "react";

import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Commitment } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { countTransaction } from "@/programs/counter.program";
import { useNetworkConfiguration } from "@/contexts/NetworkConfigurationProvider";
import { getAnchorProvider } from "@/programs/provider";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useCountRead } from "@/hooks/useCountRead";

const CounterPage = () => {
  const wallet = useAnchorWallet();
  const { networkConfiguration } = useNetworkConfiguration();
  const { visible, setVisible } = useWalletModal();
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();

  const { count } = useCountRead();

  const getProvider = useCallback(() => {
    if (!wallet) return null;
    return getAnchorProvider(wallet, networkConfiguration);
  }, [networkConfiguration, wallet]);

  const increase = async () => {
    const provider = getProvider();
    if (!provider) {
      return;
    }
    try {
      const transaction = await countTransaction({
        network: networkConfiguration,
        provider,
      });
      const txHash = await sendTransaction(transaction, connection, {
        preflightCommitment: "processed" as Commitment,
      });
      console.log("Transaction sent:", txHash);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center pt-6">
      <p className="text-lg">Count: {count}</p>{" "}
      <button onClick={increase}>Add</button>
    </div>
  );
};

export default CounterPage;
