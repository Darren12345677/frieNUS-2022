import { createSlice } from '@reduxjs/toolkit';

export const refreshSlice = createSlice({
    name: 'refresh',
    initialState: {
        refresh: false
    },
    reducers: {
        // Can mutate state directly; Do it in a mutable way as compared to Redux
        setRefreshTrue: state => {
            state.refresh = true;
        },
        setRefreshFalse: state => {
            state.refresh = false;
        },
    }
});

// Export actions so that we can dispatch and invoke the functions from anywhere in our application
export const {
    setRefreshTrue,
    setRefreshFalse,
} = refreshSlice.actions;
export default refreshSlice.reducer;