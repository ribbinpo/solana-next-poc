import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useLocalStorage } from "@solana/wallet-adapter-react";
import { createContext, ReactNode, useContext } from "react";

export interface NetworkConfigurationContextState {
  networkConfiguration: WalletAdapterNetwork;
  setNetworkConfiguration: (networkConfiguration: WalletAdapterNetwork) => void;
}

const NetworkConfigurationContext =
  createContext<NetworkConfigurationContextState>(
    {} as NetworkConfigurationContextState
  );

export const useNetworkConfiguration = (): NetworkConfigurationContextState => {
  return useContext(NetworkConfigurationContext);
};

export const NetworkConfigurationProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [networkConfiguration, setNetworkConfiguration] = useLocalStorage(
    "network",
    WalletAdapterNetwork.Devnet // set devnet by default
  );

  return (
    <NetworkConfigurationContext.Provider
      value={{ networkConfiguration, setNetworkConfiguration }}
    >
      {children}
    </NetworkConfigurationContext.Provider>
  );
};
