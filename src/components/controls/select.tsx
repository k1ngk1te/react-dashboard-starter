import { Select as AntdSelect } from "antd";
// import React from 'react';

import type { SelectProps } from "antd";

import classNames from "../../utils/classnames";

export type SelectType = SelectProps & {
	error?: string;
	label?: string;
	name?: string;
};

function Select({ label, error, onSelect, ...props }: SelectType) {
	// const [value, setValue] = React.useState(props.value || props.defaultValue || undefined);

	const className = classNames(
		"border border-gray-300 font-medium rounded-md text-sm md:text-base",
		props.className || ""
	);

	return (
		<>
			{label && (
				<label
					className={`${
						error ? "!text-red-500" : "text-gray-600"
					} form-field-label`}
					htmlFor={props.id}
				>
					{label}
				</label>
			)}
			<AntdSelect
				allowClear
				className={className}
				size="large"
				status={error ? "error" : undefined}
				style={{ width: "100%" }}
				{...props}
				onSelect={(value, option) => {
					if (onSelect) onSelect(value, option);
					// setValue(value);
				}}
			/>
			{/* <input type="hidden" name={name} id={props.id} readOnly value={value || ''} /> */}
		</>
	);
}

export default Select;
