import React from "react";
import { useAccount, useBalance } from "wagmi";
import useSwap from "../hooks/useSwap";
import Button from "./Button";
import Input from "./Input";

const UNI_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

const SwapCard = () => {
  const [quote, setQuote] = React.useState(0);
  const [amount, setAmount] = React.useState(0);
  const { address } = useAccount();

  const { data: WETHBalance } = useBalance({
    address,
    watch: true,
  });
  const { data: UNIBalance } = useBalance({
    address,
    token: UNI_ADDRESS,
    watch: true,
  });

  const { getQuote, swap } = useSwap();

  const onChangeAmountInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAmount(parseFloat(event.target.value));
    const quote = await getQuote(parseFloat(event.target.value));
    setQuote(quote);
  };

  const onClickSwapButton = async () => {
    const txn = await swap(amount);
    if (!txn) return;
    await txn.wait();
  };

  return (
    <>
      <Input
        type="number"
        placeholder="Amount in"
        onChange={onChangeAmountInput}
      />
      <p className="text-white">WETH</p>
      <p className="text-white">Balance: {WETHBalance?.formatted}</p>
      <Input
        placeholder="Amount out"
        value={quote === 0 || Number.isNaN(quote) ? "" : quote}
        disabled
      />
      <p className="text-white">UNI</p>
      <p className="text-white">Balance: {UNIBalance?.formatted}</p>
      <div className="flex justify-center mt-4 ">
        <Button disabled={address ? false : true} onClick={onClickSwapButton}>
          Swap
        </Button>
      </div>
    </>
  );
};

export default SwapCard;
