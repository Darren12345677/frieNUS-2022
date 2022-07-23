import { createSlice } from '@reduxjs/toolkit';

export const myModulesSlice = createSlice({
    name: 'myModules',
    initialState: {
        myModules: []
    },
    reducers: {
        // Can mutate state directly; Do it in a mutable way as compared to Redux
        insertModule: (state, action) => {
            const newModule = {
                desc: action.payload.desc,
                modCode: action.payload.modCode,
                semesters: action.payload.semesters,
            }
            const arr = state.myModules.slice();

            state.myModules = [
                ...arr.slice(0, action.payload.index),
                newModule,
                ...arr.slice(action.payload.index)
            ]
        },

        deleteModule: (state, action) => {
            const posDelete = action.payload.input;
            state.myModules.splice(posDelete, 1);
        },

        swapModules: (state, action) => {
            //swap A and B
            const posA = action.payload.indexA;
            const posB = action.payload.indexB;
            const arr = state.myModules.slice();
            const temp = state.myModules[posA];
            arr[posA] = arr[posB];
            arr[posB] = temp;
            state.myModules = [...arr];
        },

        clearModules: (state) => {
            state.myModules = [];
        },

        setMyModules: (state, action) => {
            state.myModules = action.payload.input;
        }
    }
});

// Export actions so that we can dispatch and invoke the functions from anywhere in our application
export const {
    insertModule,
    clearModules,
    deleteModule,
    swapModules,
    setMyModules,
} = myModulesSlice.actions;
export default myModulesSlice.reducer;