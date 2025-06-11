import { useNavigate as useRouterNavigate } from 'react-router-dom';
import React from 'react';

export default function useNavigate() {
	const routerNavigate = useRouterNavigate();

	const navigate = React.useCallback(
		(route: string) => {
			routerNavigate(route);
		},
		[routerNavigate]
	);

	const goBack = React.useCallback(() => {
		routerNavigate(-1);
	}, [routerNavigate]);

	return {
		navigate,
		goBack,
	};
}
