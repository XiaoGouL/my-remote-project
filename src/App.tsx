import { WagmiProvider } from 'wagmi';
// import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { config } from './config/wagmi';
// import { store } from './store/index'
import { RouterProvider } from 'react-router-dom'
import routes from '@/router/index'
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
  return (
    // <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <ThemeProvider theme={theme}>
              <RouterProvider router={routes} />
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    // </Provider>
  );
}

export default App;