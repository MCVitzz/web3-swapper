import { useAccount, useEnsName } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });

  return (
    <p className="text-white">
      {ensName ?? address}
      {ensName ? ` (${address})` : null}
    </p>
  );
}
