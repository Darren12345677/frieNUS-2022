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
import { Alert, KeyboardAvoidingView, SafeAreaView, StyleSheet} from "react-native";
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
    deleteDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../store/loading';
import { setRefreshTrue, } from '../store/refresh';

const FriendScreen = () => {
    const [friendList, setFriendList] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
    const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};

    const successfulDisconnectAlert = () => {
        console.log("Successful disconnect");
        Alert.alert(
            "Disconnected from friend",
            "",
            [{text:"Dismiss", onPress: () => console.log("Dismissed")}]
        )
    }

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            const currUserFriends = collection(db, 'Users/' + auth.currentUser.uid + '/Friends');
            const getFriends = async () => {
                try {
                    const friends = [];
                    await (await getDocs(currUserFriends)).forEach((doc => {
                        const friendId = doc.get('id')
                        friends.push(friendId);
                    }))
                    if (isActive) {
                        setFriendList([...friends]);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            getFriends();
            return () => {
                isActive = false;
            }
        }, [refresh])
    )

    const navigation = useNavigation();

    const disconnectHandler = async (idField) => {
        setVisible(false);
        reduxLoadingTrue();
        await deleteDoc(doc(db, "Users/" + idField + "/Friends/" + auth.currentUser.uid))
        await deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/Friends/' + idField))
        reduxRefreshTrue();
        reduxLoadingFalse();
        successfulDisconnectAlert();
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView style={{flex:1}}>
                <TopNavigation 
                    title='Friends'
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
                                <Button onPress={() => setVisible(true)} status='primary' appearance='outline' style={styles.rect}>
                                <Text status='primary'>User: {item}</Text>
                                <Modal visible={visible}
                                 onBackdropPress={() => setVisible(false)}>
                                    <Card disabled={true}>
                                        <Layout level='2'>
                                            <Button 
                                            onPress = {() => {navigation.navigate('User Profile', {userID: item}),
                                            setVisible(false)}}>
                                                <Text>View Profile</Text>
                                            </Button>
                                        </Layout>
                                        <Divider></Divider>
                                        <Button
                                        onPress={() => disconnectHandler(item)}>
                                            <Text>Disconnect</Text>
                                        </Button>
                                        <Divider></Divider>
                                        <Button onPress={() => setVisible(false)}>
                                            Dismiss
                                        </Button>
                                    </Card>
                                </Modal>
                            </Button>
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

export default FriendScreen;

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
    }
})