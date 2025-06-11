import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';

import router from './router';
import theme from './config/theme';

function App() {
  return (
    <ConfigProvider theme={theme({ themeValue: 'light' })}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
