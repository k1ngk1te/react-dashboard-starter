import VerifyEmailAddress from '../../../containers/auth/register/verify';
import Title from '../../../utils/components/title';

export default function ResetPasswordPage() {
	return (
		<>
			<Title title="Verify Email Address" />
			<VerifyEmailAddress />
		</>
	);
}
