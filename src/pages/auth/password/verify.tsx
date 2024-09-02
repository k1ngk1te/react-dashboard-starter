import VerifyPassword from '../../../containers/auth/password/verify';
import Title from '../../../utils/components/title';

export default function ResetPasswordPage() {
	return (
		<>
			<Title title="Verify Password Reset" />
			<VerifyPassword />
		</>
	);
}
