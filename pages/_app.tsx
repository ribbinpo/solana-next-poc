import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@solana/wallet-adapter-react-ui/styles.css";

import { ContextProvider } from "@/contexts/ContextProvider";
import AppBar from "@/components/AppBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <AppBar />
      <Component {...pageProps} />
      {/* Footer */}
    </ContextProvider>
  );
}
