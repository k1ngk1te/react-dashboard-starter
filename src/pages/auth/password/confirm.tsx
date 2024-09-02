import ConfirmPassword from '../../../containers/auth/password/confirm';
import Title from '../../../utils/components/title';

export default function ConfirmPasswordPage() {
	return (
		<>
			<Title title="Confirm Password Reset" />
			<ConfirmPassword />
		</>
	);
}
