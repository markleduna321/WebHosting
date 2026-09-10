import React, { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import { useGetUserQuery } from '@/store';
import { useUpdateUserMutation } from '@/features/user/userApi';

export default function Edit() {
    const { data: userData, isLoading: loadingUser } = useGetUserQuery();
    const [updateUser, { isLoading: updating, error: updateError, isSuccess }] = useUpdateUserMutation();

    const [form, setForm] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userData) {
            setForm({ name: userData.name || '', email: userData.email || '' });
        }
    }, [userData]);

    useEffect(() => {
        if (updateError && updateError.data && updateError.data.errors) {
            setErrors(updateError.data.errors);
        } else if (updateError) {
            setErrors({ _global: updateError.data?.message || 'Update failed' });
        }
    }, [updateError]);

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await updateUser(form).unwrap();
        } catch (err) {
            // errors handled by effect
        }
    };

    if (loadingUser) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <header>
                <h2 className="text-lg font-medium">Profile</h2>
                <p className="mt-1 text-sm text-gray-600">Update your account's profile information.</p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    />
                    <InputError message={errors.name?.[0]} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                    />
                    <InputError message={errors.email?.[0]} />
                </div>

                {errors._global && <div className="text-sm text-red-600">{errors._global}</div>}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={updating}>{updating ? 'Saving...' : 'Save'}</PrimaryButton>
                    {isSuccess && <p className="text-sm text-green-600">Saved.</p>}
                </div>
            </form>
        </div>
    );
}

Edit.layout = (page) => <MainLayout title="Profile">{page}</MainLayout>;
