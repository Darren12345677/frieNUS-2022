import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase';
import {
    MainScreen,
    Ex1Incorrect,
    Ex1Solution,
    Ex2Solution,
    Ex1SolutionRedux,
    CountRedux,
    AuthScreen,
    HomeScreen
} from '../screens';

const Stack = createNativeStackNavigator();
const TodoStack = createNativeStackNavigator();

const MainNavigator = () => (
    <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen
            name='Main'
            options={{ title: 'Orbital 22 React Native Workshop' }}
            component={MainScreen}
        />
        <Stack.Screen
            name='Ex1Incorrect'
            options={{ title: 'Exercise 1 (Incorrect)' }}
            component={Ex1Incorrect}
        />
        <Stack.Screen
            name='Ex1Solution'
            options={{ title: 'Exercise 1 (Solution)' }}
            component={Ex1Solution}
        />
        <Stack.Screen
            name='Ex1SolutionRedux'
            options={{ title: 'Exercise 1 (Solution Redux)' }}
            component={Ex1SolutionRedux}
        />
        <Stack.Screen
            name='Ex2Solution'
            options={{ title: 'Exercise 2 (Solution)' }}
            component={Ex2Solution}
        />
        <Stack.Screen
            name='CountRedux'
            options={{ title: 'Count with specific input' }}
            component={CountRedux}
        />
        <Stack.Screen
            name='Auth'
            options={{ headerTitle: 'TodoList' }}
            component={AuthScreen}
        />
    </Stack.Navigator>
);

const TodoNavigator = () => (
    <TodoStack.Navigator>
        <TodoStack.Screen
            name='Home'
            options={{ headerTitle: 'Home' }}
            component={HomeScreen}
        />
    </TodoStack.Navigator>
);

const AppNavigator = () => {
    /**
     * This hook serves as a listener to auth state changes provided by firebase.
     * It returns the authenticated user if he/she is present.
     */
    const [user, setUser] = useState({});
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        // Mounting function
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            authenticatedUser => {
                if (authenticatedUser) {
                    setUser(authenticatedUser);
                    setIsAuth(true);
                } else {
                    setUser({});
                    setIsAuth(false);
                }
            }
        );

        // Clean up mechanism
        // React performs clean up when component unmounts. In our case,
        // app stops running.
        return unsubscribeAuthStateChanged;
    }, []);

    return (
        <NavigationContainer>
            {isAuth ? <TodoNavigator /> : <MainNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;