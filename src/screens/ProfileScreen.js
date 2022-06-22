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
    ModuleScreen,
} from '../screens';
import { KeyboardAvoidingView, SafeAreaView,} from "react-native";
import { LogoutButton, UserResult } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    setDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';

const ProfileScreen= () => {
    const [displayNameField, setDisplayNameField] = React.useState("");
    const [emailField, setEmailField] = React.useState("");
    const [idField, setIdField] = React.useState("");

    useEffect(() => {
        const currUser = auth.currentUser;
        const userDoc = doc(db, 'Users/' + currUser.uid);
        getDoc(userDoc).then(result => {
            console.log("This is the currentUser id: " + currUser.uid);
            setDisplayNameField(result.get('displayName'));
            setEmailField(result.get('email'));
            setIdField(result.get('id'));
        })
    })

    
    return (
        <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView style={{flex:1}}>
            <TopNavigation 
                title='Profile'
                alignment='start'
                accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                accessoryRight={LogoutButton}
                style={{height:'8%'}}
            />
            <Divider/>
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text category='h1'>Profile</Text>
            <Button onPress={() => ModuleScreen}>
                BUTTON
            </Button>
            <Text>This is your current uid: {idField}</Text>
            <Text>Your email is now: {emailField} </Text>
            <Text>Your display name is: {displayNameField} </Text>
            </Layout>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ProfileScreen;