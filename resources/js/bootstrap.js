import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.Pusher = Pusher;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;

if (typeof window !== 'undefined' && reverbKey) {
	window.Echo = new Echo({
		broadcaster: 'reverb',
		key: reverbKey,
		wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
		wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
		wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
		forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'ws') === 'wss',
		enabledTransports: ['ws', 'wss'],
		withCredentials: true,
		authEndpoint: '/broadcasting/auth',
	});
}
