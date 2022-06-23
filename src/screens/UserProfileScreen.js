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
import { LogoutButton, UserResult, ConnectButton } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    getDocs,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useNavigation, useFocusEffect, useNavigationParam } from '@react-navigation/native';


const UserProfileScreen= (navigation, route) => {
    const [displayNameField, setDisplayNameField] = React.useState("");
    const [emailField, setEmailField] = React.useState("");
    const [connectListStr, setConnectListStr] = React.useState("");

    useFocusEffect(() => {
        const userDoc = doc(db, 'Users/' + route.params.userID);
        getDoc(userDoc).then(result => {
            console.log("This is the currentUser id: " + route.params.userID);
            setDisplayNameField(result.get('displayName'));
            setEmailField(result.get('email'));
        })
        const collectionConnectedUsersRef = collection(db, 'Users/' + route.params.userID + '/ConnectedUsers');
        const loadConnected =  async () => {
            const connectList = [];
            const qSnapshot = getDocs(collectionConnectedUsersRef);
            (await qSnapshot).forEach((doc) => {
                // console.log("Connected user!");
                connectList.push(doc.get('id'));
            })
            setConnectListStr(connectList.toString());
        };
        loadConnected();
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
            <Text category='h1'>Profile2</Text>
            <Divider/>
                <ConnectButton userId={route.params.userID}/>
            <Divider/>
            <Text>This is your current uid: {route.params.userID}</Text>
            <Text>Your email is now: {emailField} </Text>
            <Text>Your display name is: {displayNameField} </Text>
            <Text>These are the users you have connected with: {connectListStr} </Text> 
            </Layout>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default UserProfileScreen;