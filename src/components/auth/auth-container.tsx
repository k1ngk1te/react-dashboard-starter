import React from 'react';

import { APP_NAME, LOGO_IMAGE } from '../../config';

type AuthContainerType = {
	containerClassName?: string;
	children: React.ReactNode;
	heading: React.ReactNode;
	title: React.ReactNode;
};

function AuthContainer({
	containerClassName = 'login-container',
	children,
	heading,
	title,
}: AuthContainerType) {
	return (
		<div className="bg-white flex items-center h-full min-h-screen w-full">
			<div className="login-carousel-wrapper">
				<div className="logo-container">
					<img src={LOGO_IMAGE} alt={APP_NAME} />
				</div>
				<p className="login-carousel-description">
					Streamline Your Ecommerce Operations <br /> with Our Powerful
					Management Platform.
				</p>
			</div>
			<div className="login-wrapper">
				<div className="h-px w-px"></div>
				<div className={containerClassName}>
					<div>
						<h2 className="login-title">{heading}</h2>
						<p className="login-description">{title}</p>
					</div>
					{children}
				</div>
				<div>
					<p className="login-terms-description px-4 sm:px-2 md:px-0">
						&copy;2024 {APP_NAME} Limited. All right reserved.
					</p>
				</div>
			</div>
		</div>
	);
}

export default AuthContainer;
