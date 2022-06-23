import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';

import {
    ModuleScreen,
    SearchScreen,
    ProfileScreen,
    UserProfileScreen,
} from '../screens';
import { auth, db } from '../firebase';

const TabNavigator = () => {
    const { Navigator, Screen } = createBottomTabNavigator();
    const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Profile' icon={<Icon name='people-outline'/>} />
        <BottomNavigationTab title='Search' icon={<Icon name='search-outline'/>} />
        <BottomNavigationTab title='Modules' icon={<Icon name='book-outline'/>} />
    </BottomNavigation>
    );
    
    return (
        <Navigator 
        tabBar={props => <BottomTabBar {...props} />}
        screenOptions = {{headerShown: false}}>
            <Screen name ='Profile' component = {ProfileScreen}/>
            <Screen name='Search' component= {SearchScreen}/>
            <Screen name='Module List' component= {ModuleScreen}/>
            <Screen 
            name='User Profile' 
            component= {UserProfileScreen}
            />
        </Navigator>
    );
}

export default TabNavigator;