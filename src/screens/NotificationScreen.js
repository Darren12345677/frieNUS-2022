import React from 'react'
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Text,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView,} from "react-native";
import { LogoutButton, UserResult } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';

const NotificationScreen = () => {
    const [notifListStr, setNotifListStr] = React.useState([]);
    // const [refresh, setRefresh] = React.useState([]);

    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};
    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};

    useEffect(() => {
        console.log("Notification Screen");
        let isActive = true;
        const collectionConnectNotifRef = collection(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/')
        const getNotifications = async () => {
            try {
                const notifList = [];
                const qSnapshot = getDocs(collectionConnectNotifRef);
                await((await qSnapshot)).forEach((doc) => {
                    notifList.push(doc.get('id'));
                })
                if (isActive) {
                    setNotifListStr([...notifList]);
                }
            } catch (e) {
                console.log(e);
            }
        }
        getNotifications();
        return () => {
            // console.log("Callback");
            isActive = false;
            reduxRefreshFalse();
        }
    }, [refresh]);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         let isActive = true;
    //         const collectionConnectNotifRef = collection(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/')
    //         const getNotifications = async () => {
    //             try {
    //                 const notifList = [];
    //                 const qSnapshot = getDocs(collectionConnectNotifRef);
    //                 await((await qSnapshot)).forEach((doc) => {
    //                     notifList.push(doc.get('id'));
    //                 })
    //                 if (isActive) {
    //                     setNotifListStr([...notifList]);
    //                 }
    //             } catch (e) {
    //                 console.log(e);
    //             }
    //         }
    //         getNotifications();
    //         return () => {
    //             console.log("Callback");
    //             isActive = false;
    //             reduxLoadingFalse();
    //         }
    //     }, [isLoading])
    // );

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
                        <UserResult 
                        keyId={item.id} 
                        userFields={item} 
                        // setter={setRefresh}
                        />
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