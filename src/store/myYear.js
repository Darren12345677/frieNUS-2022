import { createSlice } from '@reduxjs/toolkit';

export const myYearSlice = createSlice({
    name: 'myYear',
    initialState: {
        myYear: 1
    },
    reducers: {
        // Can mutate state directly; Do it in a mutable way as compared to Redux
        setMyYear: (state, action) => {
            state.myYear = action.payload.input;
        },
    }
});

// Export actions so that we can dispatch and invoke the functions from anywhere in our application
export const {
    setMyYear
} = myYearSlice.actions;
export default myYearSlice.reducer;