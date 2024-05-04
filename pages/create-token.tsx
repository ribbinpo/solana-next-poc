// import {
//   MINT_SIZE,
//   TOKEN_PROGRAM_ID,
//   createInitializeMintInstruction,
//   getMinimumBalanceForRentExemptMint,
//   createAssociatedTokenAccountInstruction,
//   getAssociatedTokenAddress,
// } from "@solana/spl-token";

// import {
//   MPL_TOKEN_METADATA_PROGRAM_ID,
//   createMetadataAccountV3,
// } from "@metaplex-foundation/mpl-token-metadata";
// import axios from "axios";
// import { useNetworkConfiguration } from "@/contexts/NetworkConfigurationProvider";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { useCallback, useState } from "react";
// import { Keypair, PublicKey } from "@solana/web3.js";

// export default function CreateToken() {
//   const { connection } = useConnection();
//   const { publicKey, sendTransaction } = useWallet();
//   const { networkConfiguration } = useNetworkConfiguration();

//   const [tokenUri, setTokenUri] = useState("");
//   const [mintAddress, setMintAddress] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [token, setToken] = useState({
//     name: "",
//     symbol: "",
//     decimals: "",
//     amount: "",
//     image: "",
//     description: "",
//   });

//   const handleFormFieldsChange = (fieldName: string, e: any) => {
//     setToken({ ...token, [fieldName]: e.target.value });
//   };

//   const createToken = useCallback(async () => {
//     if (!publicKey) return;
//     const lamports = await getMinimumBalanceForRentExemptMint(connection);
//     const mintKeyPair = Keypair.generate();
//     const tokenATA = await getAssociatedTokenAddress(
//       mintKeyPair.publicKey,
//       publicKey
//     );
//     try {
//       const metadataUrl = await uploadMetadata();
//       if (!metadataUrl) return console.log("Error uploading metadata");
//       const createMetadataInstruction = createMetadataAccountV3({
//         metadata: PublicKey.findProgramAddressSync([
//           Buffer.from("metadata"),
//           MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
//           mintKeyPair.publicKey.toBuffer(),
//         ]),
//       })
//     } catch (error) {
//       console.log(error);
//     }
//   }, [connection, publicKey]);

//   const handleImageChange = async (event: any) => {
//     const file = event?.target.files[0];

//     if (file) {
//       const imgUrl = await uploadImagePinata(file);
//       if (!imgUrl) return console.log("Error uploading image");
//       setToken({ ...token, image: imgUrl });
//     }
//   };

//   const uploadImagePinata = async (file: any) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const response = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             pinata_api_key: "process",
//             pinata_secret_api_key: "",
//           },
//         }
//       );

//       const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//       return ImgHash;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   };

//   const uploadMetadata = async () => {
//     setIsLoading(true);
//     const { name, symbol, decimals, amount, image, description } = token;
//     if (!name || !symbol || !decimals || !amount || !image || !description) {
//       setIsLoading(false);
//       return console.log("Please fill all fields");
//     }
//     const data = {
//       name,
//       symbol,
//       image,
//       description,
//     };

//     try {
//       const response = await axios.post(
//         "https://api.pinata.cloud/pinning/pinJSONToIPFS",
//         data,
//         {
//           headers: {
//             pinata_api_key: "",
//             pinata_secret_api_key: "",
//           },
//         }
//       );

//       const metadataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
//       setIsLoading(false);
//       return metadataUrl;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
