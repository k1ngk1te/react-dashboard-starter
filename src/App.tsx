import { ConfigProvider, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';

import * as themeConfig from './config/static';
import router from './routes';
import { GlobalContextProvider } from './store/contexts';
// import { useThemeContext } from './store/contexts/theme';
import { ErrorBoundary } from './utils/components';

const formItemStyle = {
	colorPrimary: themeConfig.PRIMARY_COLOR,
	colorPrimaryHover: themeConfig.PRIMARY_HOVER_COLOR,
};

function App() {
	// const { theme: themeValue } = useThemeContext();

	return (
		<ConfigProvider
			theme={{
				// algorithm:
				// 	themeValue === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
				algorithm: theme.defaultAlgorithm,
				components: {
					DatePicker: formItemStyle,
					Form: {
						margin: 8,
						marginLG: 8, // adjust this value to your liking
					},
					InputNumber: formItemStyle,
					Input: formItemStyle,
					Message: {
						...formItemStyle,
						colorInfo: 'hsla(60, 1%, 51%, 1)',
					},
					Select: formItemStyle,
				},
				token: {
					colorPrimary: themeConfig.PRIMARY_COLOR,
					// colorBgBase: themeValue === 'dark' ? themeConfig.DARK_BG_BASE_COLOR : undefined,
					fontFamily: themeConfig.FONT_FAMILY,
				},
			}}
		>
			<ErrorBoundary>
				<GlobalContextProvider>
					<RouterProvider router={router} />
				</GlobalContextProvider>
			</ErrorBoundary>
		</ConfigProvider>
	);
}

export default App;
