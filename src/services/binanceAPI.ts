// Binance API 服务
export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BinanceKlineResponse {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

class BinanceAPI {
  private baseURL = '/binance/api/v3';

  /**
   * 获取K线数据
   * @param symbol 交易对，如 'BTCUSDT'
   * @param interval 时间间隔，如 '1d', '1h', '4h'
   * @param limit 数据条数，最大1000
   */
  async getKlines(
    symbol: string = 'BTCUSDT',
    interval: string = '1d',
    limit: number = 30
  ): Promise<KlineData[]> {
    try {
      const url = `${this.baseURL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BinanceKlineResponse[] = await response.json();
      
      // 转换数据格式
      return data.map((kline) => ({
        time: Math.floor(kline.openTime / 1000), // 转换为秒级时间戳
        open: parseFloat(kline.open),
        high: parseFloat(kline.high),
        low: parseFloat(kline.low),
        close: parseFloat(kline.close),
        volume: parseFloat(kline.volume),
      }));
    } catch (error) {
      console.error('Error fetching Binance klines:', error);
      throw error;
    }
  }

  /**
   * 获取实时价格
   * @param symbol 交易对
   */
  async getPrice(symbol: string = 'BTCUSDT'): Promise<number> {
    try {
      const url = `${this.baseURL}/ticker/price?symbol=${symbol}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error('Error fetching Binance price:', error);
      throw error;
    }
  }

  /**
   * 获取24小时价格变化统计
   * @param symbol 交易对
   */
  async get24hrTicker(symbol: string = 'BTCUSDT') {
    try {
      const url = `${this.baseURL}/ticker/24hr?symbol=${symbol}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching 24hr ticker:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const binanceAPI = new BinanceAPI();