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
import { LogoutButton, ImprovedAlert, AwaitButton, FriendItem } from '../components';
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

const FriendScreen = () => {
    const [friendList, setFriendList] = React.useState([]);
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
    const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};

    useEffect(() => {
        // let isActive = true;
        //     const currUserFriends = collection(db, 'Users/' + auth.currentUser.uid + '/Friends');
        //     const getFriends = async () => {
        //         try {
        //             const friends = [];
        //             await (await getDocs(currUserFriends)).forEach((doc => {
        //                 const friendId = doc.get('id')
        //                 friends.push(friendId);
        //             }))
        //             if (isActive) {
        //                 setFriendList([...friends]);
        //             }
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     }
        //     getFriends();
        //     reduxRefreshFalse();
        //     return () => {
        //         isActive = false;
        //     }
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

    const navToSearch = (item) => {
        navigation.navigate('Search');
    }

    const NoFriendDisplay = () => (
        <Layout style={styles.noFriendDisplay}>
            <Text category='p1' status='info'>
                You have no friends yet!
            </Text>
            <Button accessoryRight={searchIcon} style={styles.searchButton} onPress={navToSearch} category='p2' status='info'>
                Start connecting with other users
            </Button>
        </Layout>
    )

    const searchIcon = () => (
        <Icon name='corner-down-right-outline' fill='white' style={styles.searchIcon}></Icon>
    )

    const ListDisplay = () => (
        <>
        <List
        data={friendList}
        renderItem={({ item }) => {
            return (
                <FriendItem item = {item} />
            );
        }}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Divider}
        />
    </>
    );

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
                {friendList.length==0 ? <NoFriendDisplay/> : <ListDisplay/>}
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
    },
    popup: {
        borderRadius: 5,
    },
    noFriendDisplay: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    searchButton: {
        margin:20,
    },
    searchIcon: {
        width:20,
        height:20,
        marginHorizontal:10,
    }
})