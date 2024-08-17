export type ResponseType<DataType = undefined> = {
	message: string;
	status: 'error' | 'success';
	data: DataType;
};

export type ResponseErrorType<DataType = undefined> = {
	message: string;
	status: 'error' | 'success' | number;
	data?: DataType;
};

export type PaginatedResponseType<T> = ResponseType<{
	total: number;
	result: T;
}>;

export type QueryListOptionsType = {
	limit?: number | string;
	offset?: number | string;
	search?: string;
};

export type MutationOptionsType<T = void, U = void> = {
	onSuccess: T extends void
		? (data: Omit<ResponseType, 'data'>) => void
		: (data: ResponseType<T>) => void;
	onError?: U extends void
		? (err: ResponseErrorType) => void
		: (err: ResponseErrorType<U>) => void;
};

export type GetValidatorErrorType<T> = {
	[K in keyof T]?: T[K] extends Date | number
		? string
		: T[K] extends object
		? GetValidatorErrorType<T[K]>
		: string;
};
