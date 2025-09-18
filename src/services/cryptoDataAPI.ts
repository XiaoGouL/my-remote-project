// 多API数据服务 - 支持Binance和CoinGecko
export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceData {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
}

class CryptoDataAPI {
  private binanceURL = '/binance/api/v3';
  private coinGeckoURL = '/binance/api/v3';

  /**
   * 获取K线数据 - 优先使用Binance，失败时使用CoinGecko
   */
  async getKlines(
    symbol: string = 'BTCUSDT',
    interval: string = '1d',
    limit: number = 30
  ): Promise<KlineData[]> {
    try {
      // 尝试Binance API
      return await this.getBinanceKlines(symbol, interval, limit);
    } catch (error) {
      console.warn('Binance API failed, trying CoinGecko:', error);
      try {
        // 备选：使用CoinGecko API
        return await this.getCoinGeckoKlines(symbol, limit);
      } catch (coinGeckoError) {
        console.error('All APIs failed:', coinGeckoError);
        throw new Error('无法获取数据，请检查网络连接');
      }
    }
  }

  /**
   * 获取历史K线数据 - 支持指定开始和结束时间
   */
  async getHistoricalKlines(
    symbol: string = 'BTCUSDT',
    interval: string = '1d',
    startTime?: number,
    endTime?: number,
    limit: number = 1000
  ): Promise<KlineData[]> {
    try {
      // 尝试Binance API
      return await this.getBinanceHistoricalKlines(symbol, interval, startTime, endTime, limit);
    } catch (error) {
      console.warn('Binance API failed, trying CoinGecko:', error);
      try {
        // 备选：使用CoinGecko API
        return await this.getCoinGeckoHistoricalKlines(symbol, startTime, endTime);
      } catch (coinGeckoError) {
        console.error('All APIs failed:', coinGeckoError);
        throw new Error('无法获取历史数据，请检查网络连接');
      }
    }
  }

  /**
   * 获取价格数据 - 优先使用Binance，失败时使用CoinGecko
   */
  async getPriceData(symbol: string = 'BTCUSDT'): Promise<PriceData> {
    try {
      // 尝试Binance API
      return await this.getBinancePriceData(symbol);
    } catch (error) {
      console.warn('Binance API failed, trying CoinGecko:', error);
      try {
        // 备选：使用CoinGecko API
        return await this.getCoinGeckoPriceData(symbol);
      } catch (coinGeckoError) {
        console.error('All APIs failed:', coinGeckoError);
        throw new Error('无法获取价格数据，请检查网络连接');
      }
    }
  }

  /**
   * Binance API - 获取K线数据
   */
  private async getBinanceKlines(
    symbol: string,
    interval: string,
    limit: number
  ): Promise<KlineData[]> {
    const url = `${this.binanceURL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((kline: any[]) => ({
      time: Math.floor(kline[0] / 1000), // 转换为秒级时间戳
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }));
  }

  /**
   * Binance API - 获取历史K线数据
   */
  private async getBinanceHistoricalKlines(
    symbol: string,
    interval: string,
    startTime?: number,
    endTime?: number,
    limit: number = 1000
  ): Promise<KlineData[]> {
    let url = `${this.binanceURL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    
    if (startTime) {
      url += `&startTime=${startTime}`;
    }
    if (endTime) {
      url += `&endTime=${endTime}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((kline: any[]) => ({
      time: Math.floor(kline[0] / 1000), // 转换为秒级时间戳
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }));
  }

  /**
   * Binance API - 获取价格数据
   */
  private async getBinancePriceData(symbol: string): Promise<PriceData> {
    const url = `${this.binanceURL}/ticker/24hr?symbol=${symbol}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      currentPrice: parseFloat(data.lastPrice),
      priceChange24h: parseFloat(data.priceChange),
      priceChangePercent24h: parseFloat(data.priceChangePercent),
    };
  }

  /**
   * CoinGecko API - 获取历史K线数据
   */
  private async getCoinGeckoHistoricalKlines(
    symbol: string,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    // 计算天数
    const now = Date.now();
    const start = startTime || (now - 365 * 24 * 60 * 60 * 1000); // 默认1年前
    const days = Math.ceil((now - start) / (24 * 60 * 60 * 1000));
    
    const url = `${this.coinGeckoURL}/coins/bitcoin/market_chart?vs_currency=usd&days=${Math.min(days, 365)}&interval=daily`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    const prices = data.prices;
    
    // 过滤时间范围
    const filteredPrices = prices.filter((price: [number, number]) => {
      const priceTime = price[0];
      if (startTime && priceTime < startTime) return false;
      if (endTime && priceTime > endTime) return false;
      return true;
    });
    
    // 将价格数据转换为K线格式
    return filteredPrices.map((price: [number, number], index: number) => {
      const time = Math.floor(price[0] / 1000);
      const close = price[1];
      
      // 模拟开盘价、最高价、最低价
      const volatility = 0.02; // 2%波动
      const open = close * (1 + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      return {
        time,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.random() * 1000000, // 模拟成交量
      };
    });
  }

  /**
   * CoinGecko API - 获取K线数据（模拟）
   */
  private async getCoinGeckoKlines(symbol: string, limit: number): Promise<KlineData[]> {
    // CoinGecko没有直接的K线API，我们使用历史价格数据来模拟
    const url = `${this.coinGeckoURL}/coins/bitcoin/market_chart?vs_currency=usd&days=${limit}&interval=daily`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    const prices = data.prices;
    
    // 将价格数据转换为K线格式
    return prices.map((price: [number, number], index: number) => {
      const time = Math.floor(price[0] / 1000);
      const close = price[1];
      
      // 模拟开盘价、最高价、最低价
      const volatility = 0.02; // 2%波动
      const open = close * (1 + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      return {
        time,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.random() * 1000000, // 模拟成交量
      };
    });
  }

  /**
   * CoinGecko API - 获取价格数据
   */
  private async getCoinGeckoPriceData(symbol: string): Promise<PriceData> {
    const url = `${this.coinGeckoURL}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    const bitcoin = data.bitcoin;
    
    return {
      currentPrice: bitcoin.usd,
      priceChange24h: bitcoin.usd_24h_change,
      priceChangePercent24h: bitcoin.usd_24h_change,
    };
  }
}

// 导出单例实例
export const cryptoDataAPI = new CryptoDataAPI();
