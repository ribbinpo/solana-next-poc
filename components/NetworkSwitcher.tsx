import dynamic from "next/dynamic";

import { useNetworkConfiguration } from "@/contexts/NetworkConfigurationProvider";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const NetworkSwitcher = () => {
  const { networkConfiguration, setNetworkConfiguration } =
    useNetworkConfiguration();
  return (
    <>
      <select
        className="bg-blue-500 hover:bg-blue-700 text-white px-3 rounded-r-full"
        value={networkConfiguration}
        onChange={(e) =>
          setNetworkConfiguration(
            (e.target.value as WalletAdapterNetwork) ||
              WalletAdapterNetwork.Devnet
          )
        }
      >
        <option value={WalletAdapterNetwork.Mainnet}>mainnet</option>
        <option value={WalletAdapterNetwork.Devnet}>devnet</option>
        <option value={WalletAdapterNetwork.Testnet}>testnet</option>
      </select>
    </>
  );
};

export default dynamic(() => Promise.resolve(NetworkSwitcher), {
  ssr: false,
});
