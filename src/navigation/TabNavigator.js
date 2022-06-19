import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';

import {
    HomeScreen,
    SearchScreen,
    ProfileScreen,
} from '../screens';

const TabNavigator = () => {
    const { Navigator, Screen } = createBottomTabNavigator();

    const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Profile' icon={<Icon name='people-outline'/>} />
        <BottomNavigationTab title='Search' icon={<Icon name='search-outline'/>} />
        <BottomNavigationTab title='Edit Profile' icon={<Icon name='edit-2-outline'/>} />
    </BottomNavigation>
    );
    
    return (
        <Navigator 
        tabBar={props => <BottomTabBar {...props} />}
        screenOptions = {{headerShown: false}}>
            <Screen name ='Profile' component = {ProfileScreen}/>
            <Screen name='Search' component= {SearchScreen}/>
            <Screen name='Module List' component= {HomeScreen}/>
        </Navigator>
    );
}

export default TabNavigator;