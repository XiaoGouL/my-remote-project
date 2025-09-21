import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import Home from '@/views/Home/index';

// 定义路由配置类型
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  }
];

const router = createBrowserRouter(routes);

export default router;