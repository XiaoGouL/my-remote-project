# web3 practice

![React](https://img.shields.io/badge/React-v19.1.1-blue)
![ethers](https://img.shields.io/badge/ethers-v6.15.0-blue)
![Rainbowkit](https://img.shields.io/badge/Rainbowkit-v2.2.8-blue)
![Wagmi](https://img.shields.io/badge/Wagmi-v2.16.9-blue)
![lingui](https://img.shields.io/badge/lingui-v5.1.0-blue)
![tradingview/lightweight-charts](https://img.shields.io/badge/tradingview/lightweightCharts-v5.0.8-blue)


这是本人用于摸索 web3 里 DEX 项目开发或者其他类型的 web3 项目开发，用于学习使用的，如果看的过程中有啥问题我们可以在issues交流。

如果对你在学习 web3 的过程有任何帮助的话，那就更好了。


## 主要功能

### K线图

基于 tradingview/lightweight-charts

使用binance api数据（国内的话需要科学上网，本地运行时需要使用脚本将接口请求代理到系统代理）

支持防抖查看K线图历史数据，使用`chart.timeScale().subscribeVisibleLogicalRangeChange(func)`去做防抖，详看 [TradingChart.tsx](./src/components/TradingChart.tsx)

### 交易对的交易面板

## 启动

由于binance api需要科学上网，需要小飞机

如果小飞机端口不是7890的，需要改下小飞机的端口，或者改下package.json的script

```shell
  npm run dev
```

## 值得注意的是

使用了 RainbowKit + wagmi 去实现钱包连接的话，由于 wagmi 直接提供了 hook，所以不必像手写实现钱包功能的项目一样自己在本地维护跟管理钱包相关的状态，所以我也在某次更新中删掉了这些无用的设计，直接把状态管理交给 wagmi，并将 wagmi 这些 hook 的使用都统一封装起来，这样便于 wagmi 版本更新或者说后面更换其他的库。