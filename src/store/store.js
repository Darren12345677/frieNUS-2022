import { configureStore } from '@reduxjs/toolkit';

// Default export from count.js
import countReducer from './count';
import refreshReducer from './refresh';
import loadingReducer from './loading';

export const store = configureStore({
    reducer: {
        count: countReducer,
        refresh: refreshReducer,
        loading: loadingReducer,
    },
});
