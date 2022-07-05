import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        loading: false
    },
    reducers: {
        // Can mutate state directly; Do it in a mutable way as compared to Redux
        setLoadingTrue: state => {
            // console.log("Loading");
            state.loading = true;
        },
        setLoadingFalse: state => {
            // console.log("Loading Done");
            state.loading = false;
        },
    }
});

// Export actions so that we can dispatch and invoke the functions from anywhere in our application
export const {
    setLoadingTrue,
    setLoadingFalse,
} = loadingSlice.actions;
export default loadingSlice.reducer;