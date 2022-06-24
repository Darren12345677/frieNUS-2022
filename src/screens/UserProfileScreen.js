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
    Card,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView,} from "react-native";
import { LogoutButton, ConnectButton } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';


const UserProfileScreen= ({navigation, route}) => {
    const idField = route.params.userID
    const isYourself = idField === auth.currentUser.uid;
    const [displayNameField, setDisplayNameField] = React.useState("");
    const [emailField, setEmailField] = React.useState("");
    const [connectListStr, setConnectListStr] = React.useState("");
    const [modules, setModules] = React.useState("");
    const [friends, setFriends] = React.useState("");


    useFocusEffect(() => {
        const userDoc = doc(db, 'Users/' + idField);

        getDoc(userDoc).then(result => {
            console.log("This is the currentUser id: " + idField);
            setDisplayNameField(result.get('displayName'));
            setEmailField(result.get('email'));
        })
        const collectionPendingConnectsRef = collection(db, 'Users/' + idField + '/PendingConnects');
        
        const getPendingConnects =  async () => {
            const connectList = [];
            const qSnapshot = getDocs(collectionPendingConnectsRef);
            await ((await qSnapshot)).forEach((doc) => {
                // console.log("Connected user!");
                connectList.push(doc.get('id'));
            })

            if (connectList.length === 0) {
                console.log("No connected users");
                setConnectListStr("No connected users");
            } else {
                setConnectListStr(connectList.toString());
            }
        };

        const colRef = collection(db, 'Users/' + idField + '/Modules');
        const getModules = async () => {
            const modsList = [];
            await (await getDocs(colRef)).forEach((doc) => {
                const moduleCode = doc.get('desc');
                modsList.push(moduleCode);
            })
            
            if (modsList.length === 0) {
                console.log("modsList Length is " + modsList.length);
                setModules("Empty");
            } else {
                setModules(modsList.toString());
            }
        }

        const friendsRef = collection(db, 'Users/' + idField + '/Friends');
        const getFriends = async () => {
            const friendList = [];
            await (await getDocs(friendsRef)).forEach((doc => {
                const friendId = doc.get('id');
                friendList.push(friendId);
            }))

            if (friendList.length === 0) {
                console.log("No friends");
                setFriends("No friends");
            } else {
                setFriends(friendList.toString());
            }
        }
        getModules();
        getPendingConnects();
        getFriends();
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
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Text category='h1' style={[styles.singleLineText]}>{isYourself ? "This is your public profile" : "Searched Profile"}</Text>
                <Divider/>
                <Card status='primary' style={{flex: 1, width:'100%',}}>
                    <Layout>
                        <Text category='s1'style={[styles.singleLineText]}>ID: {idField}</Text>
                    </Layout>
                    <Layout>
                        <Text category='s1'style={[styles.singleLineText]}>Email: {emailField} </Text>
                    </Layout>
                    <Layout>
                        <Text category='s1'style={[styles.singleLineText]}>Name: {displayNameField} </Text>
                    </Layout>
                </Card>
                <Card status='info' style={{flex:4, width:'100%',}}>
                    <Layout>
                        <Text category='s2'style={[styles.manyLineText]}>These are the users they have connected with: {connectListStr} </Text> 
                    </Layout>
                    <Layout>
                        <Text category='s2'style={[styles.manyLineText]}>These are the modules they are taking: {modules}</Text>
                    </Layout>
                    <Layout>
                        <Text category='s2'style={[styles.manyLineText]}>These are their friends: {friends}</Text>
                    </Layout>
                </Card>
                <Layout style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <ConnectButton isYourself={isYourself} userId={idField}/>
                </Layout>
            </Layout>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default UserProfileScreen;

const styles = StyleSheet.create({
    singleLineText: {
        textAlign: 'center',
    },
    manyLineText: {
        textAlign: 'left',
    }
})