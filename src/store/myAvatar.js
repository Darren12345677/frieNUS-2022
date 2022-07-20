import { createSlice } from '@reduxjs/toolkit';

export const myAvatarSlice = createSlice({
    name: 'myAvatar',
    initialState: {
        myAvatar: "https://reactjs.org/logo-og.png"
    },
    reducers: {
        // Can mutate state directly; Do it in a mutable way as compared to Redux
        setMyAvatar: (state, action) => {
            state.myAvatar = action.payload.input;
        },
    }
});

// Export actions so that we can dispatch and invoke the functions from anywhere in our application
export const {
    setMyAvatar
} = myAvatarSlice.actions;
export default myAvatarSlice.reducer;