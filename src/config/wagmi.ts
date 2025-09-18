import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, base, optimism } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'React Trading App',
  projectId: '68ad8d5622aaa577a8926dfc1c16461a',
  chains: [mainnet, polygon, arbitrum, base, optimism],
  ssr: false,
});
