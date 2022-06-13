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

const TabNavigator = () => {
    const { Navigator, Screen } = createBottomTabNavigator();

    const SearchIcon = (props) => (
        <Icon {...props} name='search-outline'/>
      );

    const ProfileIcon = (props) => (
        <Icon {...props} name='people-outline'/>
    );

    const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Profile' icon={ProfileIcon} />
        <BottomNavigationTab title='Search' icon={SearchIcon} />
    </BottomNavigation>
    );
    
    return (
    <Navigator 
    tabBar={props => <BottomTabBar {...props} />}
    screenOptions = {{headerShown: false}}>
        <Screen name ='Home' component = {HomeScreen}/>
        <Screen name='Search' component={SearchScreen}/>
    </Navigator>
    );
}

export default TabNavigator;