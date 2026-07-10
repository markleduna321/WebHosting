import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import authReducer from '@/features/auth/authSlice';

function getCookieValue(name) {
	if (typeof document === 'undefined') {
		return null;
	}

	const match = document.cookie
		.split('; ')
		.find((cookie) => cookie.startsWith(`${name}=`));

	return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

// Base RTK Query API - extend this from `features/*` later.
export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: '/api',
		credentials: 'include',
		prepareHeaders: (headers) => {
			headers.set('X-Requested-With', 'XMLHttpRequest');

			const xsrfToken = getCookieValue('XSRF-TOKEN');

			if (xsrfToken) {
				headers.set('X-XSRF-TOKEN', xsrfToken);
			}

			return headers;
		},
	}),
	tagTypes: ['Auth', 'User', 'Classroom', 'Material', 'Session', 'Participant', 'QuizSubmission', 'ChatMessage'],
	endpoints: (builder) => ({
		getUser: builder.query({
			query: () => '/user',
			providesTags: ['User'],
		}),
	}),
});

export const { useGetUserQuery } = api;

const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		auth: authReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export default store;
