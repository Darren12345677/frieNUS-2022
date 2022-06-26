import React, { useState, useEffect } from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';

import { auth } from '../firebase';
import {
    AuthScreen, ProfileScreen,
} from '../screens';

import {
    TabNavigator,
} from '../navigation';

const Stack = createNativeStackNavigator();
const TodoStack = createNativeStackNavigator();
const { Navigator, Screen } = createStackNavigator();

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
      <Navigator screenOptions={{headerShown: false}}>
        <Screen name ='Authentication' component = {AuthScreen}/>
      </Navigator>
    );

    return (
        <NavigationContainer>
            {isAuth ? <TabNavigator /> : <MainNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
