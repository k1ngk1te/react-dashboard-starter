import React from 'react';

import { AuthContext } from "./provider";

import type { AuthContextType } from "./provider";

export const useAuthContext = () => {
	return React.useContext(AuthContext) as AuthContextType;
};
