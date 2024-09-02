import EmailVerificationSuccess from '../../../containers/auth/register/success';
import Title from '../../../utils/components/title';

export default function EmailVerificationSuccessPage() {
	return (
		<>
			<Title title="Email Verification Successful" />
			<EmailVerificationSuccess />
		</>
	);
}
