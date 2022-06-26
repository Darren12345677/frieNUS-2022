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
    Modal,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet} from "react-native";
import { LogoutButton } from '../components';
import { useFocusEffect, useNavigation, NavigationContainer } from '@react-navigation/native';
import { auth, db } from '../firebase';
import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    getDoc,
    doc,
    deleteDoc
} from 'firebase/firestore';

const ChatScreen = () => {
    const [friendList, setFriendList] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    useFocusEffect(() => {
        const currUserFriends = collection(db, 'Users/' + auth.currentUser.uid + '/Friends');
        const getFriends = async () => {
            const friends = [];
            await (await getDocs(currUserFriends)).forEach((doc => {
                const friendId = doc.get('id')
                friends.push(friendId);
            }))
            setFriendList([...friends]);
        }
        getFriends();
    })

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView style={{flex:1}}>
                <TopNavigation 
                    title='Chat'
                    alignment='start'
                    accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                    accessoryRight={LogoutButton}
                    style={{height:'8%'}}
                />
                <Divider/>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    rect: {
        padding: 2,
        marginVertical: 8,
        marginHorizontal: 16,
      },
    container: {
        minHeight: 192,
      },
    modalText: {
        textAlign: 'center'
    }
})