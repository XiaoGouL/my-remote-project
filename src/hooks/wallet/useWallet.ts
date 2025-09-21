import {
  useAccount as useAccountByThird,
  useBalance as useBalanceByThird,
  type UseBalanceParameters
} from 'wagmi';

function useAccount() {
  const { address, addresses, chain, chainId, connector, isConnected, isConnecting, isDisconnected, isReconnecting, status } = useAccountByThird()
  return { address, addresses, chain, chainId, connector, isConnected, isConnecting, isDisconnected, isReconnecting, status }
}

function useBalance(params: UseBalanceParameters) {
  const { status, data } = useBalanceByThird(params)
  if (status === 'success') {
    const { decimals, formatted, symbol, value } = data
    return { decimals, formatted, symbol, value, status: 'success' }
  } else {
    return { decimals: undefined, formatted: undefined, symbol: undefined, value: undefined, status: 'error' }
  }
  // { decimals: number; formatted: string; symbol: string; value: bigint; }
}

export {
  useAccount,
  useBalance,
  type UseBalanceParameters
}