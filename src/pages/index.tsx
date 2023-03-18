import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Account } from "../components";
import Page from "../components/Page";
import SwapCard from "../components/SwapCard";

const MainPage: NextPage = () => {
  const { isConnected } = useAccount();
  return (
    <Page>
      {isConnected ? (
        <div>
          <Account />
          <SwapCard />
        </div>
      ) : (
        <div className="h-min">
          <ConnectButton />
        </div>
      )}
    </Page>
  );
};

export default MainPage;
