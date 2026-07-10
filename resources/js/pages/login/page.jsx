import GuestLayout from '@/Layouts/GuestLayout';
import AuthFormSection from './_sections/AuthFormSection';

export default function LoginPage(props) {
	return <AuthFormSection mode="login" {...props} />;
}

LoginPage.layout = (page) => <GuestLayout>{page}</GuestLayout>;
