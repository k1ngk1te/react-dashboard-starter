import AuthContainer from '../../components/auth/auth-container';
import {
	Button,
	Checkbox,
	Form,
	Input,
	InputPassword,
	Link,
} from '../../components/controls';
import { REGISTER_PAGE, RESET_PASSWORD_PAGE } from '../../config';
import { useAuthContext } from '../../store/contexts';
import { useLoginMutation } from '../../store/queries/auth';
import { EmailIcon, PasswordIcon } from '../../components/icons';

const rules = [{ required: true }];

export default function Login() {
	const [form] = Form.useForm();

	const email = Form.useWatch(['email'], form);
	const password = Form.useWatch(['password'], form);

	const { login } = useAuthContext();

	const { mutate: onSubmit, isPending: loading } = useLoginMutation({
		onSuccess() {
			login({});
		},
	});

	return (
		<AuthContainer
			heading="Welcome Back!"
			title="Securely login to your admin account."
		>
			<Form
				form={form}
				name="login-form"
				onFinish={(values) => onSubmit(values)}
				className="my-3 py-3"
				disabled={loading}
			>
				<Form.Item
					name="email"
					rules={[
						...rules,
						{
							type: 'string',
						},
					]}
				>
					<Input
						icon={EmailIcon}
						label="Email Address"
						placeholder="Enter your email"
						size="large"
					/>
				</Form.Item>

				<Form.Item name="password" rules={rules}>
					<InputPassword
						icon={PasswordIcon}
						label="Password"
						placeholder="Enter your password"
						size="large"
					/>
				</Form.Item>

				<div className="flex items-center justify-between my-4">
					<div>
						<Checkbox name="remember_me" placeholder="Remember me" />
					</div>
					<Link to={RESET_PASSWORD_PAGE}>
						<span className="align-baseline capitalize cursor-pointer font-medium font-size-base inline-block primary-text-color">
							Forgot Password?
						</span>
					</Link>
				</div>

				<Button
					block
					disabled={!email || !password}
					size="large"
					type="primary"
				>
					{loading ? 'Signing in...' : 'Log in'}
				</Button>
				<p className="login-description mt-2 text-center">
					Don&rsquo;t have an account?{' '}
					<Link to={REGISTER_PAGE}>
						<span className="align-baseline cursor-pointer font-medium font-size-base primary-text-color">
							Sign Up
						</span>
					</Link>
				</p>
			</Form>
		</AuthContainer>
	);
}
