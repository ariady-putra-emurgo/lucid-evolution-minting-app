import { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";

import { Address, Blockfrost, Lucid, LucidEvolution, Network } from "@lucid-evolution/lucid";
import { Wallet } from "@/types/cardano";

import WalletConnectors from "@/components/WalletConnectors";
import Dashboard from "@/components/Dashboard";

export default function IndexPage() {
  const BF_URL = `${process.env.NEXT_PUBLIC_BF_URL}`;
  const BF_PID = `${process.env.NEXT_PUBLIC_BF_PID}`;
  const CARDANO_NETWORK = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

  const [lucid, setLucid] = useState<LucidEvolution>();
  const [address, setAddress] = useState<Address>("");
  const [result, setResult] = useState("");

  function handleError(error: any) {
    console.log(error);
    setResult("An error occured, see console.log");
  }

  useEffect(() => {
    const blockfrost = new Blockfrost(BF_URL, BF_PID);
    Lucid(blockfrost, CARDANO_NETWORK).then(setLucid).catch(handleError);
  }, []);

  async function onConnectWallet(wallet: Wallet) {
    try {
      if (!lucid) throw "Uninitialized Lucid";

      const api = await wallet.enable();

      lucid.selectWallet.fromAPI(api);

      const address = await lucid.wallet().address();

      setAddress(address);
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <DefaultLayout>
      <div className="flex justify-center overflow-hidden">
        <div className="flex flex-col gap-2 overflow-hidden">
          {lucid ? (
            address ? (
              // wallet connected: Show Dashboard
              <Dashboard address={address} lucid={lucid} setActionResult={setResult} onError={handleError} />
            ) : (
              // no wallet connected yet: Show Wallet button List
              <WalletConnectors onConnectWallet={onConnectWallet} />
            )
          ) : (
            <span className="uppercase">Initializing Lucid</span>
          )}
          <span className="font-mono break-words whitespace-pre-wrap">{result}</span>
        </div>
      </div>
    </DefaultLayout>
  );
}
