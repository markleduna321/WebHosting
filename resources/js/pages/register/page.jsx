import GuestLayout from '@/Layouts/GuestLayout';
import AuthFormSection from '@/pages/login/_sections/AuthFormSection';

export default function RegisterPage(props) {
    return <AuthFormSection mode="register" {...props} />;
}

RegisterPage.layout = (page) => <GuestLayout>{page}</GuestLayout>;