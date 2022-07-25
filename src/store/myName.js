import { createSlice } from '@reduxjs/toolkit';

export const myNameSlice = createSlice({
    name: 'myName',
    initialState: {
        myName: "NIL"
    },
    reducers: {
        // Can mutate state directly; Do it in a mutable way as compared to Redux
        setMyName: (state, action) => {
            state.myName = action.payload.input;
        },
    }
});

// Export actions so that we can dispatch and invoke the functions from anywhere in our application
export const {
    setMyName,
} = myNameSlice.actions;
export default myNameSlice.reducer;