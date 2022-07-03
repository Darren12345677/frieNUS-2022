import React, { useState, useEffect } from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions, View } from "react-native";

import { auth } from '../firebase';
import {
    AuthScreen, ProfileScreen,
} from '../screens';

import {
    TabNavigator,
} from '../navigation';

import { SpinnerView } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../store/loading';

const Stack = createNativeStackNavigator();
const TodoStack = createNativeStackNavigator();
const { Navigator, Screen } = createStackNavigator();

const AppNavigator = () => {
    /**
     * This hook serves as a listener to auth state changes provided by firebase.
     */
    const [isAuth, setIsAuth] = useState(false);
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const loading = useSelector(state => state.loading.loading);
    const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
    const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};


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
        <>
        {loading ? <SpinnerView dimWidth={windowWidth} dimHeight={windowHeight}/> : null}
        <View style={{flex: 1, zIndex: -1}}>
            <NavigationContainer>
                {isAuth ? <TabNavigator /> : <MainNavigator />}
            </NavigationContainer>
        </View>
        </>
    );
};

export default AppNavigator;
