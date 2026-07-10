import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    status: 'idle',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthUser(state, action) {
            state.user = action.payload;
            state.status = action.payload ? 'authenticated' : 'guest';
        },
        clearAuthUser(state) {
            state.user = null;
            state.status = 'guest';
        },
    },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;

export default authSlice.reducer;