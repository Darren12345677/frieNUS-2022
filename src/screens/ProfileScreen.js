import { View} from 'react-native'
import React from 'react'
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Button,
    Input,
    Text,
} from '@ui-kitten/components';
import {
    HomeScreen,
    SearchScreen,
} from '../screens';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet,} from "react-native";

const ProfileScreen= () => {
  return (
    <SafeAreaView style={{flex:1}}>
    <KeyboardAvoidingView style={{flex:1}}>
        <TopNavigation 
            title='Profile'
            alignment='start'
            accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
            style={{height:'8%'}}
        />
        <Divider/>
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text category='h1'>Profile</Text>
        <Button onPress={() => HomeScreen}>
            BUTTON
        </Button>
        </Layout>
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ProfileScreen;