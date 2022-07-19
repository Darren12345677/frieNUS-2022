import { configureStore } from '@reduxjs/toolkit';

// Default export from count.js
import countReducer from './count';
import refreshReducer from './refresh';
import loadingReducer from './loading';
import myNameReducer from './myName';
import myFacultyReducer from './myFaculty';
import myCourseReducer from './myCourse';
import myYearReducer from './myYear';

export const store = configureStore({
    reducer: {
        count: countReducer,
        refresh: refreshReducer,
        loading: loadingReducer,
        myName: myNameReducer,
        myFaculty: myFacultyReducer,
        myCourse: myCourseReducer,
        myYear: myYearReducer,
    },
});
