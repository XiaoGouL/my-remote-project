import { useState } from 'react'
import { CssBaseline } from '@mui/material'
import TradingChart from '@/components/TradingChart'
import TradingPanel from '@/components/TradingPanel'
import WalletButton from '@/components/WalletButton'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import './index.css'

export default function Home () {
  const [_, forceUpdate] = useState(0);
  // 切换语言时刷新
  function changeLanguage () {
    forceUpdate(prev => prev + 1);
  }
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  
  return (
    <>
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
    </>
  )
}
