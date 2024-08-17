import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import { APP_NAME, LOGO_IMAGE } from '../../config';

const SplashScreen = ({ title }: { title?: string }) => (
	<div className="flex flex-col flex-grow fixed h-full items-center justify-center w-full">
		<Spin
			indicator={<LoadingOutlined className="text-gray-100" />}
			spinning
			tip={
				<div className="opacity-65 mt-4">
					<div className="logo-image mx-auto">
						<img className="h-full w-full" src={LOGO_IMAGE} alt={APP_NAME} />
					</div>
					{title ? (
						<span
							className="animate-pulse duration-300 inline-block mt-4 text-gray-100 text-center text-base md:text-lg"
							style={{
								fontFamily: "'Outfit', sans-serif",
							}}
						>
							{title}
						</span>
					) : null}
				</div>
			}
			fullscreen
		/>
	</div>
);

export default SplashScreen;
