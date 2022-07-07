import React from 'react'
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Card, 
    Modal,
    Text, 
    Button, 
} from '@ui-kitten/components';
import { useFocusEffect, useNavigation, useIsFocused } from '@react-navigation/native';
import { KeyboardAvoidingView, SafeAreaView, View} from "react-native";
import { LogoutButton, NotificationEntry } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    collection,
    query, 
    onSnapshot,
    deleteDoc,
    setDoc,
    getDocs,
} from 'firebase/firestore';import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';
import { ImprovedAlert, AwaitButton } from '../components';

const NotificationScreen = () => {
    const [notifList, setNotifList] = React.useState([]);
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};
    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};
    const [visible, setVisible] = React.useState(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        // const connectNotifQuery = query(collection(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif'));
        // const unsubscribe = onSnapshot(connectNotifQuery, (snapshot) => {
        //     const connectNotif = [];     
        //     snapshot.forEach((doc) => {
        //         connectNotif.push({ id: doc.id, ...doc.data() });
        //     });
        //     setNotifList([...connectNotif]);
        // });
        // return unsubscribe;
        if (isFocused) {
            console.log('In inFocused Block', isFocused);
            fetchData();
         }
    }, [refresh, isFocused]);

    const fetchData = async () => {
        const collectionConnectNotifRef = collection(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/')
        const notifList = [];
        const qSnapshot = getDocs(collectionConnectNotifRef);
        await((await qSnapshot)).forEach((doc) => {
            notifList.push(doc.get('id'));
        })
        setNotifList([...notifList])
    }

    const successfulAcceptAlert = () => {
        ImprovedAlert("Successful Accept", "Added new friend!");
    }


    const successfulDeclineAlert = () => {
        ImprovedAlert("Successful Decline", "Declined connect request");
    }

    const acceptHandler = async (idField) => {
        setVisible(false)
        await setDoc(doc(db, 'Users/'+ auth.currentUser.uid + '/Friends/' + idField), {
            id: idField,
        })
        await setDoc(doc(db, 'Users/'+ idField + '/Friends/' + auth.currentUser.uid), {
            id: auth.currentUser.uid,
        })
        await deleteDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid))
        await deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + idField))
        successfulAcceptAlert();
    }

    const declineHandler = async (idField) => {
        setVisible(false)
        await (deleteDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid)));
        await (deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + idField)));
        successfulDeclineAlert();
    }

    const optionsHeader = (props) => (
        <View {...props}>
            <Text category='h6'>Options</Text>
        </View>
    );

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
                data={notifList}
                renderItem={({ item }) => {
                    return (        
                    <Button onPress={() => setVisible(true)} status='primary' appearance='outline' style={styles.rect}>
                    <Text status='primary'>User: {item}</Text>
                    <Modal visible={visible}
                    onBackdropPress={() => setVisible(false)}>
                        <Card disabled={true} header = {optionsHeader}>
                            <Button 
                            onPress = {() => {navigation.navigate('User Profile', {userID: item}),
                            setVisible(false)}}>
                                <Text>View Profile</Text>
                            </Button>
                            <Divider></Divider>
                            <AwaitButton awaitFunction={()=>acceptHandler(item)} title={"Accept"}/>
                            <Divider></Divider>
                            <AwaitButton awaitFunction={()=>declineHandler(item)} title={"Decline"}/>
                            <Divider></Divider>
                            <Button onPress={() => setVisible(false)}>
                                Dismiss
                            </Button>
                        </Card>
                    </Modal>
                </Button>);
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