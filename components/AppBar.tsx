import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import NetworkSwitcher from "./NetworkSwitcher";
import dynamic from "next/dynamic";

const AppBar = () => {
  return (
    <div className="min-h-16 py-2 px-6 bg-blue-400 flex justify-end">
      <>
        <WalletMultiButton />
        <NetworkSwitcher />
      </>
    </div>
  );
};

export default dynamic(() => Promise.resolve(AppBar), {
  ssr: false,
});
