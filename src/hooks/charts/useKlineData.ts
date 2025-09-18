import { useState, useEffect, useCallback } from 'react';
import { cryptoDataAPI } from '@/services/cryptoDataAPI';
import type { KlineData } from '@/services/cryptoDataAPI';
import { isEmpty } from 'lodash-es';

interface UseKlineDataOptions {
  symbol?: string;
  interval?: string;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseKlineDataReturn {
  data: KlineData[];
  loading: boolean;
  error: string | null;
  currentPrice: number | null;
  priceChange24h: number | null;
  priceChangePercent24h: number | null;
  refresh: () => Promise<void>;
  loadMoreHistory: (from: number | undefined) => Promise<void>;
  isLoadingMore: boolean;
  hasMoreData: boolean;
  timeRange: {
    start: number | null;
    end: number | null;
  };
  checkAndLoadHistory: (visibleTimeRange: { from: number; to: number }) => Promise<void>;
}

export const useKlineData = ({
  symbol = 'BTCUSDT',
  interval = '4h', // 默认4小时K线
  limit = 90, // 默认90个数据点
  autoRefresh = false,
  refreshInterval = 60000, // 1分钟
}: UseKlineDataOptions = {}): UseKlineDataReturn => {
  const [data, setData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number | null>(null);
  const [priceChangePercent24h, setPriceChangePercent24h] = useState<number | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [timeRange, setTimeRange] = useState<{ start: number | null; end: number | null }>({
    start: null,
    end: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 并行获取K线数据和价格数据
      const [klineData, priceData] = await Promise.all([
        cryptoDataAPI.getKlines(symbol, interval, limit),
        cryptoDataAPI.getPriceData(symbol),
      ]);
      setData(klineData);
      setCurrentPrice(priceData.currentPrice);
      setPriceChange24h(priceData.priceChange24h);
      setPriceChangePercent24h(priceData.priceChangePercent24h);

      // 更新时间范围
      if (klineData.length > 0) {
        setTimeRange({
          start: klineData[0].time * 1000, // 转换为毫秒
          end: klineData[klineData.length - 1].time * 1000,
        });
      }

      // 检查是否还有更多数据（简单判断：如果返回的数据少于请求的数量，说明没有更多了）
      setHasMoreData(klineData.length >= limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [symbol, interval, limit]);

  const loadMoreHistory = useCallback(async (from: number | undefined = 0) => {
    if (!hasMoreData || isLoadingMore || data.length === 0) return;

    try {
      setIsLoadingMore(true);
      setError(null);

      // 计算新的开始时间（当前最早数据的前90个数据点）
      const earliestTime = data[0].time * 1000; // 转换为毫秒
      const intervalMs = interval === '4h' ? 4 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 4小时或1天
      const newStartTime = isEmpty(from)
        ? earliestTime - (limit * intervalMs) // 往前加载limit个数据点
        : earliestTime - (Math.abs(from || 0) * intervalMs)

      // 获取历史数据
      const historicalData = await cryptoDataAPI.getHistoricalKlines(
        symbol,
        interval,
        newStartTime,
        earliestTime - 1, // 结束时间设为当前最早数据的前一天
        limit
      );

      if (historicalData.length > 0) {
        // 合并数据（历史数据在前，当前数据在后）
        const mergedData = [...historicalData, ...data];
        setData(mergedData);

        // 更新时间范围
        setTimeRange({
          start: historicalData[0].time * 1000,
          end: data[data.length - 1].time * 1000,
        });

        // 检查是否还有更多数据
        setHasMoreData(historicalData.length >= limit);
      } else {
        setHasMoreData(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more data';
      setError(errorMessage);
    } finally {
      setIsLoadingMore(false);
    }
  }, [data]);

  const checkAndLoadHistory = useCallback(async (visibleTimeRange: { from: number; to: number }) => {
    // 如果数据还在加载中，或者没有数据，或者正在加载更多数据，则跳过
    if (loading || !hasMoreData || isLoadingMore || data.length === 0) {
      return;
    }

    // 检查可见时间范围是否超出了我们当前数据的最早时间
    const earliestDataTime = data[0].time;
    const bufferTime = interval === '4h' ? 2 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 4小时K线用2天缓冲，日线用7天缓冲

    // 如果用户查看的时间范围早于我们当前最早的数据时间减去缓冲时间
    if (visibleTimeRange.from < (earliestDataTime - bufferTime)) {
      await loadMoreHistory();
    } else {
      console.log('No need to load more history');
    }
  }, [loading, hasMoreData, isLoadingMore, data, loadMoreHistory, interval]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    currentPrice,
    priceChange24h,
    priceChangePercent24h,
    refresh,
    loadMoreHistory,
    isLoadingMore,
    hasMoreData,
    timeRange,
    checkAndLoadHistory,
  };
};