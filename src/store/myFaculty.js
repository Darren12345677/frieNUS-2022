import { createSlice } from '@reduxjs/toolkit';

export const myFacultySlice = createSlice({
    name: 'myFaculty',
    initialState: {
        myFaculty: "NIL"
    },
    reducers: {
        // Can mutate state directly; Do it in a mutable way as compared to Redux
        setMyFaculty: (state, action) => {
            state.myFaculty = action.payload.input;
        },
    }
});

// Export actions so that we can dispatch and invoke the functions from anywhere in our application
export const {
    setMyFaculty
} = myFacultySlice.actions;
export default myFacultySlice.reducer;