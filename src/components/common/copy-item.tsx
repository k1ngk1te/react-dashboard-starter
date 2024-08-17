import React from 'react';

import { TEST_MODE } from '../../config';
import { useToastContext } from '../../store/contexts';

function CopyItem({
	button: ButtonComponent,
}: {
	button: React.ComponentType<{
		onCopy: (item?: string | number | null) => void;
	}>;
}) {
	const { open } = useToastContext();

	const handleCopy = React.useCallback(
		(item: string | number | null = '') => {
			navigator.clipboard
				.writeText((item || '').toString())
				.then(() => {
					open({
						type: 'info',
						message: 'Copied to clipboard.',
					});
				})
				.catch((err) => {
					open({
						type: 'error',
						message: TEST_MODE ? (err as any).message : "Couldn't copy.",
					});
				});
		},
		[open]
	);

	return <ButtonComponent onCopy={handleCopy} />;
}

export default CopyItem;
