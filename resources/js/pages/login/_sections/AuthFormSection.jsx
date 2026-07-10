import { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { useDispatch } from 'react-redux';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { useLoginUserMutation, useRegisterUserMutation } from '@/features/auth/authApi';
import { setAuthUser } from '@/features/auth/authSlice';

const defaultForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
};

export default function AuthFormSection({ canResetPassword = false, mode, status }) {
    const isRegister = mode === 'register';
    const dispatch = useDispatch();
    const [form, setForm] = useState(defaultForm);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loginUser, loginState] = useLoginUserMutation();
    const [registerUser, registerState] = useRegisterUserMutation();
    const mutationState = isRegister ? registerState : loginState;

    useEffect(() => {
        const apiErrors = mutationState.error?.data?.errors;

        if (apiErrors) {
            setErrors(apiErrors);
            setGlobalError('');
            return;
        }

        if (mutationState.error) {
            setGlobalError(mutationState.error.data?.message || 'Unable to continue with your request.');
        }
    }, [mutationState.error]);

    const handleChange = (field) => (event) => {
        const value = event.target.value;

        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
        setGlobalError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setGlobalError('');

        try {
            const payload = isRegister
                ? form
                : {
                      email: form.email,
                      password: form.password,
                  };

            const response = isRegister
                ? await registerUser(payload).unwrap()
                : await loginUser(payload).unwrap();

            dispatch(setAuthUser(response.user));
            router.visit('/profile');
        } catch {
            // RTK Query exposes handled errors through mutation state.
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">AsuraTECH Classroom</p>
                <h1 className="text-3xl font-semibold text-slate-900">
                    {isRegister ? 'Create your web workspace' : 'Sign in to the web workspace'}
                </h1>
                <p className="text-sm text-slate-600">
                    {isRegister
                        ? 'Set up a separate web session without affecting the mobile classroom flow.'
                        : 'Use your classroom account to access the standalone web app.'}
                </p>
            </div>

            {status && <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div>}
            {globalError && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{globalError}</div>}

            <form className="space-y-5" onSubmit={handleSubmit}>
                {isRegister && (
                    <div>
                        <InputLabel htmlFor="name" value="Full name" />
                        <TextInput id="name" className="mt-1 block w-full" value={form.name} onChange={handleChange('name')} />
                        <InputError className="mt-2" message={errors.name?.[0]} />
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="email" value="Email address" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={form.email}
                        onChange={handleChange('email')}
                    />
                    <InputError className="mt-2" message={errors.email?.[0]} />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Password" />
                        {!isRegister && canResetPassword && (
                            <Link href="/forgot-password" className="text-sm text-slate-500 transition hover:text-slate-900">
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        className="mt-1 block w-full"
                        value={form.password}
                        onChange={handleChange('password')}
                    />
                    <InputError className="mt-2" message={errors.password?.[0]} />
                </div>

                {isRegister && (
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="mt-1 block w-full"
                            value={form.password_confirmation}
                            onChange={handleChange('password_confirmation')}
                        />
                        <InputError className="mt-2" message={errors.password_confirmation?.[0]} />
                    </div>
                )}

                <PrimaryButton className="flex w-full items-center justify-center" disabled={mutationState.isLoading}>
                    {mutationState.isLoading
                        ? (isRegister ? 'Creating account...' : 'Signing in...')
                        : (isRegister ? 'Create account' : 'Sign in')}
                </PrimaryButton>
            </form>

            <div className="text-center text-sm text-slate-600">
                {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
                <Link href={isRegister ? '/login' : '/register'} className="font-medium text-slate-900 transition hover:text-slate-700">
                    {isRegister ? 'Sign in' : 'Create one'}
                </Link>
            </div>
        </div>
    );
}