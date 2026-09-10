import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action) => {
            state.sidebarCollapsed = Boolean(action.payload);
        },
        openMobileSidebar: (state) => {
            state.mobileSidebarOpen = true;
        },
        closeMobileSidebar: (state) => {
            state.mobileSidebarOpen = false;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarCollapsed,
    openMobileSidebar,
    closeMobileSidebar,
} = uiSlice.actions;

export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectMobileSidebarOpen = (state) => state.ui.mobileSidebarOpen;

export default uiSlice.reducer;
