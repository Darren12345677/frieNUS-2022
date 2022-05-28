import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

import { auth } from '../firebase';
import {
    AuthScreen,
    HomeScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const TodoStack = createNativeStackNavigator();

const AppNavigator = () => {
    /**
     * This hook serves as a listener to auth state changes provided by firebase.
     */
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        // Mounting function
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            (authenticatedUser) => {
                if (authenticatedUser) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            }
        );

        // Clean up mechanism
        // React performs clean up when component unmounts. In our case,
        // app stops running.
        return () => unsubscribeAuthStateChanged();
    }, []);

    const MainNavigator = () => (
        <Stack.Navigator initialRouteName="Auth">
            <Stack.Screen
                name="Auth"
                options={{ headerTitle: 'frieNUS' }}
                component={AuthScreen}
            />
        </Stack.Navigator>
    );

    const logoutHandler = () => {
        signOut(auth).then(() => {
            setIsAuth(false);
        });
    };

    const LogoutIcon = () => (
        <TouchableOpacity onPress={logoutHandler}>
            <MaterialIcons name="logout" size={28} color="#407BFF" />
        </TouchableOpacity>
    );

    const TodoNavigator = () => (
        <TodoStack.Navigator>
            <TodoStack.Screen
                name="Home"
                options={{
                    headerTitle: 'Home',
                    headerRight: () => <LogoutIcon />,
                }}
                component={HomeScreen}
            />
        </TodoStack.Navigator>
    );

    return (
        <NavigationContainer>
            {isAuth ? <TodoNavigator /> : <MainNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
