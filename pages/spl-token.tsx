import { useNetworkConfiguration } from "@/contexts/NetworkConfigurationProvider";
import { getAnchorProvider } from "@/programs/provider";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMint,
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  MINT_SIZE,
  mintTo,
  TOKEN_PROGRAM_ID,
  transferChecked,
} from "@solana/spl-token";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { FormEvent, useEffect, useState } from "react";

export default function CreateToken() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey, sendTransaction } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();

  const [isLoading, setIsLoading] = useState(false);
  const [mint, setMint] = useState<PublicKey | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >("");
  const [balance, setBalance] = useState<number | null>(null);

  const [mintPubKey, setMintPubKey] = useState<string>("");
  const [ownerPubKey, setOwnerPubKey] = useState<string>("");
  const [txCreateTokenAccount, setTxCreateTokenAccount] = useState<string>("");
  const [tokenAccount, setTokenAccount] = useState<string>("");
  const [balanceSPL, setBalanceSPL] = useState<string | null>(null);
  const [tokenAmount, setTokenAmount] = useState<string>("");

  // const newPublicWalletAddress = Keypair.generate();

  // For no provider
  // const initializeToken = async () => {
  //   if (!publicKey || !wallet || !connection) {
  //     return;
  //   }
  //   const airdropWalletTX = await connection.requestAirdrop(
  //     newPublicWalletAddress.publicKey,
  //     1 * LAMPORTS_PER_SOL
  //   );
  //   if (!airdropWalletTX) {
  //     return "error"; //some error to stop the flow for airdrop didn't happen
  //   }
  //   console.log(
  //     "New Wallet Address: ",
  //     newPublicWalletAddress.secretKey,
  //     newPublicWalletAddress.publicKey.toBase58()
  //   );
  //   console.log("Airdrop TX: ", airdropWalletTX);
  //   //Step 1 - Creating the mint account for the new wallet address
  //   const mintPubKey = await createMint(
  //     connection,
  //     newPublicWalletAddress, // payer
  //     newPublicWalletAddress.publicKey, // mint authority
  //     newPublicWalletAddress.publicKey, // freeze authority
  //     9 // decimals
  //   );
  //   console.log("Mint PubKey: ", mintPubKey.toBase58());
  //   const mintAccount = await getMint(connection, mintPubKey);
  //   console.log("Mint Account: ", mintAccount);

  //   //Step 2 -  Get or Create the ATA (AssociatedTokenAccount) for new created wallet
  //   const myToken = await getOrCreateAssociatedTokenAccount(
  //     connection,
  //     newPublicWalletAddress, // payer
  //     mintPubKey, // mint account
  //     newPublicWalletAddress.publicKey // owner
  //   );
  //   console.log("My Token Account:", myToken);

  //   const tokenAmount = await connection.getTokenAccountBalance(
  //     myToken.address
  //   );
  //   console.log("Token Amount: ", tokenAmount);
  //   //Step 3 - Minting the token for that new wallet
  //   await mintTo(
  //     connection,
  //     newPublicWalletAddress, // payer
  //     mintPubKey, // mint account
  //     myToken.address, // destination account
  //     newPublicWalletAddress.publicKey, // mint authority
  //     123456 * LAMPORTS_PER_SOL //Number of tokens need to mint
  //   );

  //   await transferToken(mintPubKey, myToken.address);
  // };

  // const transferToken = async (
  //   mintPubKey: PublicKey,
  //   tokenPubKey: PublicKey
  // ) => {
  //   if (!publicKey || !wallet || !connection) {
  //     return;
  //   }
  //   const provider = getAnchorProvider(wallet, networkConfiguration);

  //   const newToken = await getOrCreateAssociatedTokenAccount(
  //     provider.connection,
  //     newPublicWalletAddress, // payer
  //     mintPubKey, // mint account
  //     provider.publicKey // owner
  //   );

  //   console.log("New Token Account: ", newToken);

  //   await transferChecked(
  //     connection,
  //     newPublicWalletAddress, // payer
  //     tokenPubKey, // from (token account)
  //     mintPubKey, // mint publicKey
  //     newToken.address, // to (token account)
  //     newPublicWalletAddress, // owner
  //     10 * 1e9,
  //     9
  //   );

  //   const tokenAmount = await connection.getTokenAccountBalance(
  //     newToken.address
  //   );
  //   console.log("New Token Amount: ", tokenAmount);
  // };

  // const getTokenAmount = async () => {
  //   if (!publicKey || !wallet || !connection) {
  //     return;
  //   }
  //   const provider = getAnchorProvider(wallet, networkConfiguration);

  //   const newToken = await getOrCreateAssociatedTokenAccount(
  //     provider.connection,
  //     newPublicWalletAddress, // payer
  //     new PublicKey(""), // mint account
  //     provider.publicKey // owner
  //   );
  //   const tokenAmount = await connection.getTokenAccountBalance(
  //     newToken.address
  //   );
  //   console.log("New Token Detail: ", newToken);
  //   console.log("Token Amount: ", tokenAmount);
  // };

  // Frontend Wallet

  // 1 - Create Mint Account
  const createMintToken = async () => {
    setIsLoading(true);
    if (!publicKey || !wallet || !connection) {
      return;
    }
    const provider = getAnchorProvider(wallet, networkConfiguration);
    const mint = Keypair.generate();
    const lamports = await connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );
    console.log("lamports", lamports / LAMPORTS_PER_SOL);
    const tx = new Transaction().add(
      // create mint account
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      // init mint account
      createInitializeMintInstruction(
        mint.publicKey, // mint pubkey
        9, // decimals
        provider.publicKey, // mint authority
        provider.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
        TOKEN_PROGRAM_ID
      )
    );
    console.log(tx);
    try {
      const txHash = await sendTransaction(tx, connection, {
        preflightCommitment: "processed",
        signers: [mint],
      });
      setMint(mint.publicKey);
      setTransactionSignature(txHash);
      console.log("Mint PubKey: ", mint.publicKey.toBase58());
      console.log("TX Hash: ", txHash);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  // 2 - Get Wallet Balance
  useEffect(() => {
    if (!publicKey || !connection) {
      return;
    }
    connection?.getBalance(publicKey).then((balance) => {
      console.log("Balance: ", balance);
      setBalance(balance / LAMPORTS_PER_SOL);
    });
  }, [connection, publicKey]);

  // 3 - Create Token Account
  const createTokenAccount = async (event: FormEvent) => {
    event.preventDefault();
    if (!publicKey || !wallet || !connection) {
      return;
    }
    setIsLoading(true);
    const mint = new PublicKey(mintPubKey);
    const owner = new PublicKey(ownerPubKey);

    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_PROGRAM_ID
    );
    console.log("Associated Token: ", associatedToken.toBase58());
    const tx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
    try {
      const txHash = await sendTransaction(tx, connection, {
        preflightCommitment: "processed",
      });
      console.log("TX Hash: ", txHash);
      setTxCreateTokenAccount(txHash);
      setTokenAccount(associatedToken.toBase58());
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  // 4 - Mint to Token Account
  const mintTokenAccount = async () => {
    if (!publicKey || !wallet || !connection) {
      return;
    }

    setIsLoading(true);

    const mint = new PublicKey(mintPubKey);
    const owner = new PublicKey(ownerPubKey);

    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_PROGRAM_ID
    );

    const transaction = new Transaction().add(
      createMintToInstruction(
        mint,
        associatedToken,
        publicKey,
        +tokenAmount * 1e9
      )
    );
    try {
      const txHash = await sendTransaction(transaction, connection, {
        preflightCommitment: "processed",
      });
      console.log("TX Hash: ", txHash);
      await connection.confirmTransaction(txHash, "confirmed");
      const account = await getAccount(connection, associatedToken);
      const bal = account.amount.toString();
      setBalanceSPL(bal);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>SPL Token</h1>
      {/* <button onClick={async () => await initializeToken()}>
        Create Token
      </button>
      <button onClick={async () => await getTokenAmount()}>
        Get Token Amount
      </button> */}

      <h1 className="text-3xl">SPL Token (With Providers)</h1>
      <p>My Balance: {balance || 0} SOL</p>
      <h2 className="text-xl">MINT ACCOUNT</h2>
      <p>Mint Account: {mint && mint.toBase58()}</p>
      <p>
        Transaction Signature: {transactionSignature} (
        <a
          target="_blank"
          href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=${networkConfiguration}`}
        >Link</a>
        )
      </p>

      <button onClick={async () => await createMintToken()}>
        {isLoading ? "Creating..." : "Create Mint Account"}
      </button>
      <h2 className="text-xl">TOKEN ACCOUNT</h2>
      <form
        className="flex flex-col space-y-1 w-1/2"
        onSubmit={createTokenAccount}
      >
        <label className="text-red-700 font-semibold">Mint PubKey</label>
        <input
          className="px-1 text-black"
          type="text"
          value={mintPubKey}
          onChange={(e) => setMintPubKey(e.target.value)}
        />
        <label className="text-red-700 font-semibold">Owner PubKey</label>
        <input
          className="px-1 text-black"
          type="text"
          value={ownerPubKey}
          onChange={(e) => setOwnerPubKey(e.target.value)}
        />
        <button type="submit">Create Token Account</button>
      </form>
      <p>Token Account: {tokenAccount}</p>
      <p>Transaction (Token Account): {txCreateTokenAccount}</p>

      <h2 className="text-xl">MINT To</h2>
      <input
        type="number"
        className="px-1 text-black"
        value={tokenAmount}
        onChange={(e) => setTokenAmount(e.target.value)}
      />
      <button onClick={async () => await mintTokenAccount()}>
        {isLoading ? "Minting..." : "Mint To Token Account"}
      </button>
      <p>Balance SPL: {+(balanceSPL || 0) / LAMPORTS_PER_SOL}</p>
    </div>
  );
}
