import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { config } from './config/wagmi';
import { store } from './store/index'
import TradingChart from './components/TradingChart';
import TradingPanel from './components/TradingPanel';
import WalletButton from './components/WalletButton';
import LanguageSwitcher from './components/LanguageSwitcher';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css'

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
});

function App() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const [_, forceUpdate] = useState(0);

  // 切换语言时刷新
  function changeLanguage () {
    forceUpdate(prev => prev + 1);
  }
  return (
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className='app-container'>
                  {/* 顶部按钮区域 */}
                  <div className='container-header'>
                    <LanguageSwitcher onSwicth={() => changeLanguage()} />
                    <WalletButton />
                  </div>
                  
                  {/* 主内容区域 */}
                  <div className='container-content'>
                    {/* K线图区域 */}
                    <div className='content-kline'>
                      <TradingChart onPriceUpdate={setCurrentPrice} />
                    </div>
                    
                    {/* 交易面板区域 */}
                    <div className='trading-panel'>
                      <TradingPanel 
                        currentPrice={currentPrice}
                        symbol="BTCUSDT"
                      />
                    </div>
                  </div>
                </div>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  );
}

export default App;