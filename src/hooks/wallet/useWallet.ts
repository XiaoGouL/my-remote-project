import { useAccount, useConnect, useChainId, useDisconnect } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/index';
import { updateConnectionStatus, updateChainId, updateAddress } from '@/store/walletSlice';
import { useEffect } from 'react';


export function useWallet() {
  const dispatch = useDispatch();
  const { address, isConnected, isConnecting, connector } = useAccount();
  const chainId = useChainId();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();


  const walletState = useSelector((state: RootState) => state.wallet);

  // 状态同步逻辑
  useEffect(() => {
    dispatch(updateConnectionStatus(isConnecting ? 'connecting' : isConnected ? 'connected' : 'disconnected'));
    if (isConnected) {
      dispatch(updateChainId(chainId));
      dispatch(updateAddress(address || null));
    }
  }, [isConnected, chainId, address, isConnecting, dispatch]);

  const connectWallet = async () => {
    dispatch(updateConnectionStatus('connecting'));
    try {
      const connectResult = await connect({connector: connectors[0]});
      console.log('connectResult', connectResult)
      // 可添加连接成功后的额外逻辑
    } catch (err) {
      dispatch(updateConnectionStatus('disconnected'));
    }
  };

  const disconnectWallet = () => {
    disconnect();
    dispatch(updateConnectionStatus('disconnected'));
    dispatch(updateChainId(null));
    dispatch(updateAddress(null));
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet
  };
}