import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Slider,
  Divider,
  Alert,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { t } from '@lingui/macro';
import { formatPrice, formatNumber } from '@/utils'

interface TradingPanelProps {
  currentPrice: number | null;
  symbol: string;
}


const TradingPanel: React.FC<TradingPanelProps> = ({ currentPrice, symbol }) => {
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [amount, setAmount] = useState<string>('');
  const [leverage, setLeverage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleLeverageChange = (_event: Event, newValue: number | number[]) => {
    setLeverage(newValue as number);
  };

  const handlePlaceOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError(t`Please enter a valid trading amount`);
      return;
    }
    
    setError(null);
    
    // 提交订单
  };

  const calculateMargin = () => {
    if (!amount || !currentPrice) return 0;
    return (parseFloat(amount) * currentPrice) / leverage;
  };

  const calculateNotional = () => {
    if (!amount || !currentPrice) return 0;
    return parseFloat(amount) * currentPrice;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        overflow: 'hidden',
        height: 'fit-content',
        minHeight: '600px',
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* 当前价格 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
            {t`Current Price`}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: '#d1d4dc'
            }}
          >
            {formatPrice(currentPrice)}
          </Typography>
        </Box>

        {/* 交易方向选择 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={side === 'long' ? 'contained' : 'outlined'}
              onClick={() => setSide('long')}
              startIcon={<TrendingUp />}
              sx={{
                flex: 1,
                backgroundColor: side === 'long' ? '#26a69a' : 'transparent',
                color: side === 'long' ? 'white' : '#26a69a',
                borderColor: '#26a69a',
                '&:hover': {
                  backgroundColor: side === 'long' ? '#26a69a' : 'rgba(38, 166, 154, 0.1)',
                  borderColor: '#26a69a',
                },
              }}
            >
              {t`Open`}
            </Button>
            <Button
              variant={side === 'short' ? 'contained' : 'outlined'}
              onClick={() => setSide('short')}
              startIcon={<TrendingDown />}
              sx={{
                flex: 1,
                backgroundColor: side === 'short' ? '#ef5350' : 'transparent',
                color: side === 'short' ? 'white' : '#ef5350',
                borderColor: '#ef5350',
                '&:hover': {
                  backgroundColor: side === 'short' ? '#ef5350' : 'rgba(239, 83, 80, 0.1)',
                  borderColor: '#ef5350',
                },
              }}
            >
              {t`Close`}
            </Button>
          </Box>
        </Box>

        {/* 交易数量 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
            {t`Trading Amount`}
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.0000"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#d1d4dc',
                '& fieldset': {
                  borderColor: '#2a2a2a',
                },
                '&:hover fieldset': {
                  borderColor: '#26a69a',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#26a69a',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#888' }}>
              {t`Margin`}: ${formatNumber(calculateMargin())}
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              {t`Notional Value`}: ${formatNumber(calculateNotional())}
            </Typography>
          </Box>
        </Box>

        {/* 杠杆设置 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
            {t`Leverage`}: {leverage}x
          </Typography>
          <Slider
            value={leverage}
            onChange={handleLeverageChange}
            min={1}
            max={50}
            step={1}
            marks={[
              { value: 1, label: '1x' },
              { value: 5, label: '5x' },
              { value: 10, label: '10x' },
              { value: 20, label: '20x' },
              { value: 50, label: '50x' }
            ]}
            sx={{
              color: '#26a69a',
              '& .MuiSlider-thumb': {
                backgroundColor: '#26a69a',
              },
              '& .MuiSlider-track': {
                backgroundColor: '#26a69a',
              },
              '& .MuiSlider-mark': {
                backgroundColor: '#2a2a2a',
              },
              '& .MuiSlider-markLabel': {
                color: '#888',
                fontSize: '0.75rem',
              },
            }}
          />
        </Box>

        {/* 交易按钮 */}
        <Button
          fullWidth
          variant="contained"
          onClick={handlePlaceOrder}
          sx={{
            backgroundColor: side === 'long' ? '#26a69a' : '#ef5350',
            color: 'white',
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            mb: 3,
            '&:hover': {
              backgroundColor: side === 'long' ? '#1e8e7a' : '#d32f2f',
            },
          }}
        >
          {side === 'long' ? t`Open` : t`Close`}
        </Button>

        <Divider sx={{ borderColor: '#2a2a2a', mb: 3 }} />

        {/* 错误提示 */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 2,
              backgroundColor: '#2d1b1b',
              color: '#ef5350',
              '& .MuiAlert-icon': {
                color: '#ef5350',
              },
            }}
          >
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default TradingPanel;
