import { AnchorProvider } from "@coral-xyz/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Commitment, Connection } from "@solana/web3.js";

export const getPublicProvider = (network: WalletAdapterNetwork) => {
  return new Connection(clusterApiUrl(network), "confirmed");
};

export const getAnchorProvider = (
  wallet: AnchorWallet,
  network: WalletAdapterNetwork
) => {
  const connection = new Connection(
    clusterApiUrl(network),
    "processed" as Commitment
  );
  return new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed" as Commitment,
  });
};
