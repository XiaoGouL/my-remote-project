import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// 屏蔽掉RainbowKit+wagmi平台的分析服务，没啥用而且太烦了=。=
// 定义分析服务的域名和路径
const ANALYTICS_DOMAINS = [
  'cca-lite.coinbase.com/metrics',
];

// 保存原始的 fetch 函数
const originalFetch = window.fetch;

// 创建拦截器函数
const createAnalyticsBlocker = (): void => {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // 检查是否是分析请求
    const isAnalyticsRequest = ANALYTICS_DOMAINS.some(domain => 
      url?.includes(domain)
    );
    
    if (isAnalyticsRequest) {
      console.log('Analytics request blocked:', url);
      
      // 返回一个空的成功响应
      return Promise.resolve(
        new Response(null, {
          status: 200,
          statusText: 'OK',
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        })
      );
    }
    
    // 正常的请求，使用原始的 fetch
    return originalFetch(input, init);
  };
};

// 初始化配置
export const initializeWagmiConfig = () => {
  // 先设置拦截器
  if (typeof window !== 'undefined') {
    createAnalyticsBlocker();
  }
  
  // 创建配置
  const config = getDefaultConfig({
    appName: 'React Trading App',
    projectId: '68ad8d5622aaa577a8926dfc1c16461a',
    chains: [mainnet, sepolia],
    ssr: true, // 禁用 SSR 分析
  });
  
  return config;
};

// 导出配置
export const config = initializeWagmiConfig();
