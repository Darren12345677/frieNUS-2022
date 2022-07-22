import React, {useEffect, useState, useRef} from 'react'
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
import { LogoutButton, AwaitButton, SpinnerView, MessageItem } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    onSnapshot,
    query, 
    orderBy,
    FieldValue,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';
import { TextInput } from 'react-native-gesture-handler';
import { keyboardProps } from 'react-native-web/dist/cjs/modules/forwardedProps';
import { initializeAuth } from 'firebase/auth';

const SingleChatScreen= ({navigation, route}) => {
    const idField = route.params.userID;
    const [message, setMessage] = useState('');  
    const [messageList, setMessageList] = useState([])
    const isFocus = useIsFocused();

    useEffect(() => {
        const messageQuery = query(collection(db, 'Users/' + auth.currentUser.uid + '/Friends/' + idField + '/Messages'), orderBy('creation'))
        const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
            const messages = [];
            snapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            setMessageList([...messages]);
        })
        return unsubscribe
    }, [isFocus]);

    const onSubmitHandler = async () => {
        if (message.length === 0) {
            
        } else {
            addDoc(collection(db, 'Users/' + auth.currentUser.uid + '/Friends/' + idField + '/Messages'), {
                desc: message, 
                sender: auth.currentUser.uid,
                creation: serverTimestamp()
            });
            addDoc(collection(db, 'Users/' + idField + '/Friends/' + auth.currentUser.uid + '/Messages'), {
                desc: message, 
                sender: auth.currentUser.uid,
                creation: serverTimestamp()
            });
            const data1 = {
                id: auth.currentUser.uid,
                lastUpdate:serverTimestamp(), 
                lastMessage:message
            }
            updateDoc(doc(db, 'Users/' + idField + '/Friends/' + auth.currentUser.uid), data1);
            updateDoc(doc(db, 'Users/' + auth.currentUser.uid + '/Friends/' + idField), {
                id:idField,
                lastUpdate:serverTimestamp(), 
                lastMessage:message
            });
            console.log(message)
        }
        setMessage('')
    }

    const renderItem = ({ item }) => {
        return <MessageItem item={item} />
    }

    const scrollViewRef = useRef();

    return (
        <SafeAreaView style={styles.container}>
            <TopNavigation 
                title={idField}
                alignment='start'
                accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                accessoryRight={LogoutButton}
                style={{height:'8%'}}
            />
            <Divider/>
                <List
                    data={messageList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ref={scrollViewRef}
                    onContentSizeChange={() => {
                        scrollViewRef.current.scrollToEnd({ animated: false })
                    }}
                    style={styles.list}
                />
            <View style={styles.containerInput}>
                <Input
                    value = {message}
                    onChangeText = {setMessage}
                    placement = 'center'
                    style={styles.input}
                    placeholder = 'send a message'>
                    </Input>
                    <AwaitButton 
                    awaitFunction={onSubmitHandler} 
                    size='medium'
                    appearance='ghost'
                    status='basic'
                    justifyContent='center'
                    accessoryLeft={<Icon name='paper-plane-outline' pack='eva'/>}
                    />
            </View>
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
    containerInput: {
        flexDirection: 'row',
        backgroundColor: 'azure'
    },
    container: {
        justifyContent: 'flex-end',
        flex: 1
    },
    input: {
        backgroundColor: 'lightblue',
        borderRadius: 4,
        flex: 20,
        marginLeft: 10,
        padding: 10, 
    },
    list: {
        overflow: 'scroll',
    },
});