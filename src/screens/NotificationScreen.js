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
import {  useNavigation, useIsFocused } from '@react-navigation/native';
import { KeyboardAvoidingView, SafeAreaView, View} from "react-native";
import { LogoutButton, NotifItem } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    collection,
    query, 
    onSnapshot,
    deleteDoc,
    setDoc,
} from 'firebase/firestore';import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { ImprovedAlert, AwaitButton } from '../components';

const NotificationScreen = () => {
    const [notifList, setNotifList] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const connectNotifQuery = query(collection(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif'));
        const unsubscribe = onSnapshot(connectNotifQuery, (snapshot) => {
            const connectNotif = [];     
            snapshot.forEach((doc) => {
                connectNotif.push({ id: doc.id, ...doc.data() });
            });
            setNotifList([...connectNotif]);
        });
        return unsubscribe;
    }, []);

    const optionsHeader = (props) => (
        <View {...props}>
            <Text category='h6'>Options</Text>
        </View>
    );

    const NoNotifDisplay = () => (
        <Layout style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text category='p1' status='info' style={[styles.noNotifText]}>
                You do not have any notifications yet
            </Text>
        </Layout>
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
                {notifList.length != 0 ? <List
                data={notifList}
                renderItem={({ item }) => {
                    return (        
                    <NotifItem item = {item} />);
                }}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={Divider}
                /> : <NoNotifDisplay/>}
                {/* <Modal 
                visible={visible}
                onBackdropPress={() => setVisible(false)}>
                <Card disabled={true} header={optionsHeader}>
                <Text>{userItem}</Text>
                <Button 
                onPress = {() => {
                    console.log(userItem);
                    navigation.navigate('User Profile', {userID: userItem}),
                    setVisible(false);
                    }}>
                <Text>View Profile</Text>
                </Button>
                <Divider></Divider>
                <AwaitButton awaitFunction={()=>acceptHandler(userItem)} children={"Accept"}/>
                <Divider></Divider>
                <AwaitButton awaitFunction={()=>declineHandler(userItem)} children={"Decline"}/>
                <Divider></Divider>
                <Button onPress={() => setVisible(false)}>
                    Dismiss
                </Button>
                </Card>
            </Modal> */}
            </Layout>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default NotificationScreen;

const styles = StyleSheet.create({
    listContainer: {
        // backgroundColor:'red',
        flex: 1,
        width:'100%',
    }, 
    noNotifText: {
        textAlign: 'center',
        textAlignVertical: 'center',
    }
})