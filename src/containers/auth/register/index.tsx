import { useNavigate } from 'react-router-dom';

import AuthContainer from '../../../components/auth/auth-container';
import {
	Button,
	Form,
	Input,
	InputPassword,
	Link,
} from '../../../components/controls';
import { EMAIL_VERIFY_PAGE, LOGIN_PAGE } from '../../../config';
import { useLoginMutation } from '../../../store/queries/auth';
import { EmailIcon, PasswordIcon, UserIcon } from '../../../components/icons';

const rules = [{ required: true }];

export default function Register() {
	const navigate = useNavigate();

	const [form] = Form.useForm();
	const email = Form.useWatch(['email'], form);
	const password = Form.useWatch(['password'], form);

	const { mutate: onSubmit, isPending: loading } = useLoginMutation({
		onSuccess() {
			// login({});
			navigate(EMAIL_VERIFY_PAGE);
		},
	});

	return (
		<AuthContainer
			containerClassName="register-container"
			heading="Hi there! Welcome"
			title="Sign up for an account with us"
		>
			<Form
				form={form}
				name="register-form"
				onFinish={(values) => onSubmit(values)}
				className="my-3 py-3 grid grid-cols-1 gap-y-1 gap-x-6 md:gap-x-4 md:grid-cols-2 lg:gap-x-6"
				disabled={loading}
			>
				<Form.Item name="fullName" rules={rules}>
					<Input
						icon={UserIcon}
						label="Full Name"
						placeholder="Full Name"
						size="large"
					/>
				</Form.Item>

				<Form.Item name="username" rules={rules}>
					<Input
						icon={UserIcon}
						label="Username"
						placeholder="username"
						size="large"
					/>
				</Form.Item>

				<Form.Item
					className="col-span-full"
					name="email"
					rules={[
						...rules,
						{
							type: 'email',
						},
					]}
				>
					<Input
						icon={EmailIcon}
						label="Email Address"
						placeholder="Email Address"
						size="large"
					/>
				</Form.Item>

				<Form.Item name="password" rules={rules}>
					<InputPassword
						icon={PasswordIcon}
						label="Password"
						placeholder="Enter Password"
						size="large"
					/>
				</Form.Item>

				<Form.Item name="password2" rules={rules}>
					<InputPassword
						icon={PasswordIcon}
						label="Confirm Password"
						placeholder="Confirm password"
						size="large"
					/>
				</Form.Item>

				<div className="mt-4 col-span-full">
					<Button
						block
						disabled={!email || !password}
						size="large"
						type="primary"
					>
						{loading ? 'Registering...' : 'Sign Up'}
					</Button>
					<p className="register-description mt-2 text-center">
						Already have an account?{' '}
						<Link to={LOGIN_PAGE}>
							<span className="align-baseline cursor-pointer font-medium font-size-base primary-text-color">
								Sign In
							</span>
						</Link>
					</p>
				</div>
			</Form>
		</AuthContainer>
	);
}
