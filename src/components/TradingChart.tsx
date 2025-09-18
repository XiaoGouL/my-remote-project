import React, { useCallback, useEffect, useRef } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, Button, Chip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useKlineData } from '@/hooks/charts/useKlineData';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { LogicalRange } from 'lightweight-charts';
import { t } from '@lingui/macro';
import { useDebouncedCallback } from 'use-debounce';
import { formatPrice } from '@/utils'

// 声明全局类型
declare global {
  interface Window {
  klineData: Array<any>;
  count: number;
  LightweightCharts: any;
  }
}


interface TradingChartProps {
  onPriceUpdate?: (price: number | null) => void;
}

const TradingChart: React.FC<TradingChartProps> = ({ onPriceUpdate }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  let {
    data: klineData,
    loading,
    error,
    currentPrice,
    priceChange24h,
    priceChangePercent24h,
    refresh,
    loadMoreHistory,
    isLoadingMore,
    // hasMoreData,
    timeRange,
    // checkAndLoadHistory,
  } = useKlineData({
    symbol: 'BTCUSDT',
    interval: '4h', // 改为4小时K线，这样数据更密集
    limit: 90, // 增加到90个数据点（约15天）
    autoRefresh: false,
    refreshInterval: 0
  });

  const dealVisibleLogicalRangeChange = useCallback((logicalRange: LogicalRange | null) => {
    const { from, to } = logicalRange || { from: 0, to: 0 };
    if (from < 0) {
      loadMoreHistory(from)
    }
  }, [loadMoreHistory])

  const handleDebounceLogicalRangeChange = useDebouncedCallback(dealVisibleLogicalRangeChange, 600)

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // 创建图表
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      grid: {
        vertLines: {
          color: '#2a2a2a',
        },
        horzLines: {
          color: '#2a2a2a',
        },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#2a2a2a',
      },
      timeScale: {
        borderColor: '#2a2a2a',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // 创建K线图系列
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // 响应式调整
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (chart) {
        chart.remove();
      }
    };
  }, []);

    useEffect(() => {
    if (chartRef.current) {
      chartRef.current.timeScale().subscribeVisibleLogicalRangeChange(handleDebounceLogicalRangeChange);
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.timeScale().unsubscribeVisibleLogicalRangeChange(handleDebounceLogicalRangeChange);
      }
    }
  }, [chartRef?.current])

  // 更新图表数据
  useEffect(() => {
    if (seriesRef.current && klineData.length > 0) {
      seriesRef.current.setData(klineData);
    }
  }, [klineData]);

  // 更新当前价格到父组件
  useEffect(() => {
    if (onPriceUpdate && currentPrice !== null) {
      onPriceUpdate(currentPrice);
    }
  }, [currentPrice, onPriceUpdate]);

  const formatChange = (change: number | null) => {
    if (change === null) return 'N/A';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatChangePercent = (percent: number | null) => {
    if (percent === null) return 'N/A';
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #2a2a2a' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="h5"
              sx={{
                color: '#d1d4dc',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              📈 {t`BTC/USDT Trading Chart (4H)`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refresh}
                disabled={loading}
                sx={{
                  color: '#26a69a',
                  borderColor: '#26a69a',
                  '&:hover': {
                    borderColor: '#26a69a',
                    backgroundColor: 'rgba(38, 166, 154, 0.1)',
                  },
                }}
              >
                {t`Refresh`}
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#d1d4dc', fontWeight: 600 }}>
                {formatPrice(currentPrice)}
              </Typography>
            </Box>
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: priceChange24h && priceChange24h >= 0 ? '#26a69a' : '#ef5350',
                  fontWeight: 600 
                }}
              >
                {formatChange(priceChange24h)} ({formatChangePercent(priceChangePercent24h)})
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#888' }}>
              {t`24h Change`}
            </Typography>
          </Box>

          {/* 时间范围显示 */}
          {timeRange.start && timeRange.end && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#888' }}>
                {t`Data Range`}:
              </Typography>
              <Chip
                label={`${new Date(timeRange.start).toLocaleDateString()} - ${new Date(timeRange.end).toLocaleDateString()}`}
                size="small"
                sx={{
                  backgroundColor: '#2a2a2a',
                  color: '#d1d4dc',
                  fontSize: '0.75rem',
                }}
              />
              <Chip
                label={`${klineData.length} ${t`data points`}`}
                size="small"
                sx={{
                  backgroundColor: '#26a69a',
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
              {isLoadingMore && (
                <Chip
                  label={t`Loading historical data...`}
                  size="small"
                  sx={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Box>
          )}
        </Box>

        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" sx={{ backgroundColor: '#2d1b1b', color: '#ef5350' }}>
              {t`Data loading failed`}: {error}
            </Alert>
          </Box>
        )}

        <Box sx={{ position: 'relative' }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CircularProgress sx={{ color: '#26a69a' }} />
              <Typography variant="body2" sx={{ color: '#d1d4dc' }}>
                {t`Loading data...`}
              </Typography>
            </Box>
          )}
          
          <Box
            ref={chartContainerRef}
            sx={{
              width: '100%',
              height: '600px',
              position: 'relative',
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TradingChart;