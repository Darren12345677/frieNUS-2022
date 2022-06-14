import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';

import {
    HomeScreen,
    SearchScreen,
} from '../screens';

const TabNavigator = () => {
    const { Navigator, Screen } = createBottomTabNavigator();

    const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Profile' icon={<Icon name='people-outline'/>} />
        <BottomNavigationTab title='Search' icon={<Icon name='search-outline'/>} />
    </BottomNavigation>
    );
    
    return (
        <Navigator 
        tabBar={props => <BottomTabBar {...props} />}
        screenOptions = {{headerShown: false}}>
            <Screen name ='Home' component = {HomeScreen}/>
            <Screen name='Search' component= {SearchScreen}/>
        </Navigator>
    );
}

export default TabNavigator;