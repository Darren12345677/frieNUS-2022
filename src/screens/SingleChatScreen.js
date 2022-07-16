import React, {useEffect, useState} from 'react'
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
    Spinner,
} from '@ui-kitten/components';
import { Dimensions, KeyboardAvoidingView, SafeAreaView, View, ScrollView} from "react-native";
import { LogoutButton, AwaitButton, SpinnerView } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    onSnapshot,
    query, 
} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';
import { TextInput } from 'react-native-gesture-handler';

const SingleChatScreen= ({navigation, route}) => {
    const idField = route.params.userID;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])
    

    useEffect(() => {
        const messageQuery = query(collection(db, 'Users/' + auth.currentUser.uid + '/Friends/' + idField + '/Messages'))
        const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
            const messages = [];
            snapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            setMessages([...messages]);
        })
        return unsubscribe
    }, []);

    const onSubmitHandler = async () => {
        if (message.length === 0) {
            return;
        } else {
            addDoc(collection(db, 'Users/' + auth.currentUser.uid + '/Friends/' + idField + '/Messages'), {
                desc: message, 
                sender: auth.currentUser.uid
            });
            addDoc(collection(db, 'Users/' + idField + '/Friends/' + auth.currentUser.uid + '/Messages'), {
                desc: message, 
                sender: auth.currentUser.uid
            });
        }
        setMessage('')
    }

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
            <Layout level='1' style={{flex: 1, flexDirection:"column"}}>
                <Layout level='1' style={{marginHorizontal:20, flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'center', direction:'inherit', flexWrap:'nowrap'}}>
                <Layout style={{marginBottom:30, width:'90%', justifyContent:'center'}}>  
                <TextInput
                    value = {message}
                    onChangeText = {setMessage}
                    placement = 'bottom'
                    placeholder = 'send a message'>
                    </TextInput>
                </Layout>
                <Layout level='1' style={{width:'10%'}}>
                    <AwaitButton 
                    awaitFunction={onSubmitHandler} 
                    style={styles.button} 
                    accessoryLeft={<Icon name='plus-outline' pack='eva'/>}
                    status='primary'
                    />
                </Layout>
                </Layout>
            </Layout>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default SingleChatScreen;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
        flexDirection: 'column',
        //backgroundColor: 'red',
    },
    listContainer: {
        // backgroundColor:'red',
        flex: 10,
        width: '100%',
    },
    list: {
        overflow: 'scroll',
    },
    inputContainer: {
        backgroundColor:'black',
        flex: 1,
        paddingVertical: 10,
    },
    AC: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    button: {
        flex: 0.05,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 3,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    noModulesText: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});