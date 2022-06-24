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
import { LogoutButton, ConnectButton, UserResult } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const NotificationScreen = () => {
    const [notifListStr, setNotifListStr] = React.useState([]);


    useFocusEffect(() => {
        const collectionConnectNotifRef = collection(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/')
        const getNotifications = async () => {
            const notifList = [];
            const qSnapshot = getDocs(collectionConnectNotifRef);
            await ((await qSnapshot)).forEach((doc) => {
                // console.log("Connected user!");
                notifList.push(doc.get('id'));
            })

            if (notifList.length === 0) {
                console.log("No Notifications");
                //setConnectListStr("No Notifications");
            } else {
                //setConnectListStr(notifList.toString());
            }
            setNotifListStr([...notifList]);
        }
        getNotifications();
    })

    return (
        <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView style={{flex:1}}>
            <TopNavigation 
                title='Notifications'
                alignment='start'
                accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                accessoryRight={LogoutButton}
                style={{height:'8%'}}
            />
            <Divider/>
            <Layout style={styles.listContainer}>
                <List
                data={notifListStr}
                renderItem={({ item }) => {
                    return (
                        // <Button appearance='outline'>
                        // <Text>User ID: {item}</Text>
                        // </Button>
                        <UserResult userFields={item}/>
                        )
                }}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={Divider}
                />
            </Layout>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default NotificationScreen;

const styles = StyleSheet.create({
    singleLineText: {
        textAlign: 'center',
    },
    manyLineText: {
        textAlign: 'left',
    },
    listContainer: {
        backgroundColor:'red',
        flex: 1,
        width:'100%',
    }
})