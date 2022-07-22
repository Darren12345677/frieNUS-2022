import React, {useCallback} from 'react'
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
    Modal,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet} from "react-native";
import { LogoutButton, ImprovedAlert, AwaitButton } from '../../components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import {
    collection,
    doc,
    deleteDoc,
    onSnapshot,
    query, 
    getDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../../store/loading';
import { setRefreshFalse, } from '../../store/refresh';

const FriendItem = ({item}) => {
    const [visible, setVisible] = React.useState(false);
    const [userItem, setUserItem] = React.useState(item.id);
    const [userDisplay, setUserDisplay] = React.useState(item.id);
    const navigation = useNavigation();

    useEffect(() => {
        const userDoc = doc(db, 'Users/' + item.id);
        const setCurrUser = () => {
            getDoc(userDoc).then(result => {
                if (result.get('name') != 'Not selected') {
                    setUserDisplay(result.get('name'));
                }
            })
        }
        setCurrUser();
    }, [])

    const disconnectHandler = async (idField) => {
        setVisible(false);
        await deleteDoc(doc(db, "Users/" + idField + "/Friends/" + auth.currentUser.uid))
        await deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/Friends/' + idField))
        successfulDisconnectAlert();
    }
    
    const navToChat = (item) => {
        navigation.navigate('Messages', {userID: item, displayName:userDisplay});
        setVisible(false);
    }
    
    const navToUser = (item) => {
        navigation.navigate('User Profile', {userID: item});
        setVisible(false);
    }

    return (
        <Layout>
        <Button onPress={() => {setVisible(true) 
            setUserItem(item.id)}} status='basic' appearance='outline' 
            style={styles.rect}>
            <Text category='s1' appearance='alternative'>{userDisplay}</Text>
        </Button>
        <Modal 
        visible={visible}
        onBackdropPress={() => setVisible(false)}>
            <Card disabled={true} status='info' style={[styles.popup]}>
                <Button 
                onPress = {() => {navToChat(userItem)}}>Chat
                </Button>
                <Divider/>
                <Button 
                onPress = {() => {navToUser(userItem)}}>View Profile
                </Button>
                <Divider></Divider>
                <AwaitButton awaitFunction={() => disconnectHandler(userItem)} children={"Disconnect"}/>
                <Divider/>
                <Button onPress={() => setVisible(false)}>Dismiss</Button>
            </Card>
        </Modal>
        </Layout>
    )
}

export default FriendItem;

const styles = StyleSheet.create({
    rect: {
        marginVertical: 5,
        marginHorizontal: 16,
      },
    container: {
        minHeight: 192,
      },
    modalText: {
        textAlign: 'center'
    },
    singleLineText: {
        textAlign: 'center',
    },
    manyLineText: {
        textAlign: 'left',
    },
    listContainer: {
        // backgroundColor:'red',
        flex: 1,
        width:'100%',
    },
    popup: {
        borderRadius: 5,
    },
    noFriendDisplay: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    disconnectButton: {
        margin:0,
    },
    searchIcon: {
        width:20,
        height:20,
        marginHorizontal:10,
    }
})