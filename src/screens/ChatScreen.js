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
import { LogoutButton, ImprovedAlert, AwaitButton } from '../components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import {
    collection,
    doc,
    deleteDoc,
    onSnapshot,
    query, 
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../store/loading';
import { setRefreshFalse, } from '../store/refresh';

const ChatScreen = () => {
    const [friendList, setFriendList] = React.useState([]);
    const refresh = useSelector(state => state.refresh.refresh);

    const successfulDisconnectAlert = () => {
        ImprovedAlert("Successful disconnect", "Disconnected from friend");
    }

    useEffect(() => {
        const friendQuery = query(collection(db, 'Users/' + auth.currentUser.uid + '/Friends'));
        const unsubscribe = onSnapshot(friendQuery, (snapshot) => {
            const friends = [];     
            snapshot.forEach((doc) => {
                friends.push({ id: doc.id, ...doc.data() });
            });
            setFriendList([...friends]);
        });
        return unsubscribe;
    }, [refresh]);

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
                <Layout style={styles.listContainer}>
                        <List
                        data={friendList}
                        renderItem={({ item }) => {
                            return (
                                <Button onPress={() => navigation.navigate('Messages', {userID: item.id})} status='primary' appearance='filled' style={styles.rect}>
                                <Text category='s1' appearance='alternative'>User: {item.id}</Text>
                            </Button>
                            );
                        }}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={Divider}
                        />
                    </Layout>
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
})