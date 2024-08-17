import { Descriptions as AntdDescriptions, DescriptionsProps } from "antd";
import React from "react";

import AppImage from "./image";
import Tag, { type TagType } from "./tag";

import type { DescriptionsItemProps } from "antd/es/descriptions/Item";

type AppImageType = {
	src: string;
	alt?: string;
};

export type DescriptionsType = DescriptionsProps & {
	description?: React.ReactNode;
	title?: React.ReactNode;
	descriptions?: (Omit<DescriptionsItemProps, "children"> & {
		key: string;
		title: string;
		type?: "badge" | "image";
		value: React.ReactNode | AppImageType | TagType;
	})[];
};

function Descriptions({
	descriptions = [],
	title,
	description,
	...props
}: DescriptionsType) {
	return (
		<AntdDescriptions
			bordered
			column={1}
			layout="horizontal"
			contentStyle={{
				paddingRight: "1rem",
			}}
			// column={2}
			// layout="vertical"
			items={descriptions.map(
				({ type, value, key, title, ...descriptionProps }) => {
					const imageValue =
						type === "image" && "src" in (value as AppImageType)
							? {
									src: (value as AppImageType).src,
									alt: (value as AppImageType).alt || "",
							  }
							: undefined;
					const tagValue = type === "badge" ? (value as TagType) : undefined;
					return {
						key: key,
						label: title,
						children:
							type === "image" && imageValue ? (
								<AppImage
									className="rounded-full h-[150px] w-[150px]"
									{...imageValue}
								/>
							) : type === "badge" && tagValue ? (
								<Tag {...tagValue} />
							) : (
								<>{value}</>
							),
						...descriptionProps,
					};
				}
			)}
			title={
				title || description ? (
					<>
						{title && (
							<h3 className="text-gray-600 capitalize text-sm leading-6 font-medium dark:text-gray-300">
								{title}
							</h3>
						)}
						{description && (
							<p className="font-normal mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-200">
								{description}
							</p>
						)}
					</>
				) : undefined
			}
			{...props}
		/>
	);
}

export default Descriptions;
