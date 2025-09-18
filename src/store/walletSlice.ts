import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface WalletState {
  isConnected: boolean;
  chainId: number | String | null;
  address: string | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

const initialState: WalletState = {
  isConnected: false,
  chainId: null,
  address: null,
  connectionStatus: 'disconnected'
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateConnectionStatus: (state, action: PayloadAction<WalletState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
    },
    updateChainId: (state, action: PayloadAction<number | null>) => {
      state.chainId = action.payload;
    },
    updateAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
      state.isConnected = !!action.payload;
    }
  }
});

export const { updateConnectionStatus, updateChainId, updateAddress } = walletSlice.actions;
export default walletSlice.reducer;