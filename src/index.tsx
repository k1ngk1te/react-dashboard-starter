import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import ThemeProvider from './store/contexts/theme/provider.tsx';

import 'antd/dist/reset.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</React.StrictMode>
);
