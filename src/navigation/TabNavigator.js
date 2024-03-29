import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon, Text, Layout } from '@ui-kitten/components';

import {
    ModuleScreen,
    SearchScreen,
    ProfileScreen,
    UserProfileScreen,
    NotificationScreen,
    ChatScreen, 
    FriendScreen,
    SingleChatScreen,
    ProfileSettingsScreen,
    AccountSettingsScreen,
} from '../screens';
import { auth, db } from '../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';

const TabNavigator = () => {
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};
    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};

    const { Navigator, Screen } = createBottomTabNavigator();
    const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => {
            //Makes screen lag
            // reduxRefreshTrue();
            return navigation.navigate(state.routeNames[index])}}>
        <BottomNavigationTab  icon={<Icon name='people-outline'/>} />
        <BottomNavigationTab  icon={<Icon name='search-outline'/>} />
        <BottomNavigationTab  icon={<Icon name='book-outline'/>} />
        <BottomNavigationTab  icon={<Icon name='bell-outline'/>} />
        <BottomNavigationTab 
        // onPress doesn't work for some reason
        // onPressIn={() => console.log("Hello")}
        icon={<Icon name='message-circle-outline'/>}/>
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
            <Screen name='User Profile' component= {UserProfileScreen}/>
            <Screen name='Friends' component= {FriendScreen}/>
            <Screen name='Messages' component= {SingleChatScreen}/>
            <Screen name='Profile Settings' component= {ProfileSettingsScreen}/>
            <Screen name='Account Settings' component= {AccountSettingsScreen}/>
        </Navigator>
    );
}

export default TabNavigator;