import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';

import {
    ModuleScreen,
    SearchScreen,
    ProfileScreen,
    UserProfileScreen,
    NotificationScreen,
    ChatScreen, 
    FriendScreen,
} from '../screens';
import { auth, db } from '../firebase';

const TabNavigator = () => {
    const { Navigator, Screen } = createBottomTabNavigator();
    const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab  icon={<Icon name='people-outline'/>} />
        <BottomNavigationTab  icon={<Icon name='search-outline'/>} />
        <BottomNavigationTab  icon={<Icon name='book-outline'/>} />
        <BottomNavigationTab  icon={<Icon name='bell-outline'/>} />
        <BottomNavigationTab  icon={<Icon name='message-circle-outline'/>} />
    </BottomNavigation>
    );
    
    return (
        <Navigator 
        tabBar={props => <BottomTabBar {...props} />}
        screenOptions = {{headerShown: false}}>
            <Screen name ='Profile' component = {ProfileScreen}/>
            <Screen name='Search' component= {SearchScreen}/>
            <Screen name='Module List' component= {ModuleScreen}/>
            <Screen name='Notification' component= {NotificationScreen}/>
            <Screen name='Chat' component= {ChatScreen}/>
            <Screen 
            name='User Profile' 
            component= {UserProfileScreen}
            />
            <Screen name='Friends' component= {FriendScreen}/>
        </Navigator>
    );
}

export default TabNavigator;