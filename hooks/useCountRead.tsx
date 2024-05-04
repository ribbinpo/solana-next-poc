import { useNetworkConfiguration } from "@/contexts/NetworkConfigurationProvider";
import {
  CounterData,
  counterPDA,
  counterProgram,
} from "@/programs/counter.program";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";

export const useCountRead = () => {
  const { networkConfiguration } = useNetworkConfiguration();
  const { connection } = useConnection();
  const [counterData, setCounterData] = useState<CounterData | null>(null);

  useEffect(() => {
    const program = counterProgram(networkConfiguration);

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
  }, [connection, networkConfiguration]);

  const count = useMemo(() => {
    return counterData?.count.toString() || "0";
  }, [counterData?.count]);

  return { count };
};
