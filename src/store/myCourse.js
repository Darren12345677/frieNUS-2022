import { createSlice } from '@reduxjs/toolkit';

export const myCourseSlice = createSlice({
    name: 'myCourse',
    initialState: {
        myCourse: "NIL"
    },
    reducers: {
        // Can mutate state directly; Do it in a mutable way as compared to Redux
        setMyCourse: (state, action) => {
            state.myCourse = action.payload.input;
        },
    }
});

// Export actions so that we can dispatch and invoke the functions from anywhere in our application
export const {
    setMyCourse
} = myCourseSlice.actions;
export default myCourseSlice.reducer;