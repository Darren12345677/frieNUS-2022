import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { NavigationContainer, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout, Text, Icon } from '@ui-kitten/components';

import { auth } from '../firebase';
import {
    AuthScreen,
    HomeScreen,
    SearchScreen,
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


    const FrieNUSLogo = () => {
        return(
            <TouchableOpacity>
                <Image source={require('../assets/logofrienus.png')} style={styles.logo} />
            </TouchableOpacity>);
    };

    const MainNavigator = () => (
        // <Stack.Navigator initialRouteName="Auth">
        //     <Stack.Screen
        //         name="Authentication"
        //         options={
        //             { title: "Authentication",
        //             headerTitleStyle: {
        //                 color: 'orange',
        //             },
        //             headerStyle: {
        //                 backgroundColor: '#0073e6',
        //             },
        //             headerTitleAlign: 'center',
        //             headerLeft: () => <FrieNUSLogo />}}
        //         component={AuthScreen}
        //     />
        // </Stack.Navigator>
      <Navigator screenOptions={{headerShown: false}}>
        <Screen name ='Authentication' component = {AuthScreen}/>
      </Navigator>
    );

    const logoutHandler = () => {
        signOut(auth).then(() => {
            setIsAuth(false);
        });
    };

    const LogoutIcon = () => (
        <TouchableOpacity onPress={logoutHandler}>
            <MaterialIcons name="logout" size={28} color="#6696ff" />
        </TouchableOpacity>
    );

    // const TodoNavigator = () => (
    //     // <TodoStack.Navigator>
    //     //     <TodoStack.Screen
    //     //         name="Home"
    //     //         options={{
    //     //             headerTitle: 'Home',
    //     //             headerTitleStyle: {
    //     //                 color: 'orange',
    //     //             },
    //     //             headerStyle: {
    //     //                 backgroundColor: '#0073e6',
    //     //             },
    //     //             headerTitleAlign: 'center',
    //     //             headerRight: () => <LogoutIcon />,
    //     //             headerLeft: () => <FrieNUSLogo />,
    //     //         }}
    //     //         component={HomeScreen}
    //     //     />
    //     // </TodoStack.Navigator>
    //     <Navigator screenOptions={{headerShown: false}}>
    //       <Screen name ='Home' component = {HomeScreen}/>
    //     </Navigator>
    // );




    return (
        <NavigationContainer>
            {isAuth ? <TabNavigator /> : <MainNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 30,
        resizeMode: 'contain',
    },
});