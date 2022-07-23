import React from 'react'
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Button,
    Text,
    Avatar,
} from '@ui-kitten/components';
import { auth, db } from '../../firebase';
import {
    collection,
    onSnapshot,
    query, 
    doc,
    getDoc, 
} from 'firebase/firestore';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View, TouchableOpacity, Image} from "react-native";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import myAvatar from '../../store/myAvatar';

const ChatItem = ({item}) => {
    const started = item.lastUpdate != null;
    const [userName, setUserName] = React.useState(item.id);
    const [avatar, setAvatar] = React.useState(null);
    useEffect(() => {
        const userDoc = doc(db, 'Users/' + item.id);
        const setCurrUser = () => {
            getDoc(userDoc).then(result => {
                if (result.get('name') != 'Not selected') {
                    setUserName(result.get('name'));
                }
                setAvatar(result.get('avatar'));
            })
        }
        setCurrUser();
    }, [])


    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Messages', {userID: item.id, 
        displayName: userName})} status='primary' appearance='filled'>
        <Image style={styles.image} source={{ uri: avatar }} />
        <View style={{ flex: 1 }}>
            <Text style={styles.userDisplay}>{userName}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        <Text style={styles.date}>{started?item.lastUpdate.toDate().toISOString().slice(0,10):null}</Text>
        </TouchableOpacity>
    )
}

export default ChatItem;

const styles = StyleSheet.create({
    userDisplay: {
        fontSize: 16,
        fontWeight: 'bold'
    }, 
    lastMessage: {
        fontSize: 13,
        color: 'gray'
    },
    button: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center', 
        backgroundColor: 'lightcyan'
    },
    image: {
        backgroundColor: 'grey',
        height: 60,
        aspectRatio: 1,
        borderRadius: 30,
        marginRight: 16, 
        justifyContent: 'center', 
        alignItems:'center'
    },
    date: {
        color: 'gray', 
    }
})