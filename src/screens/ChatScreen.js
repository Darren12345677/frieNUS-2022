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
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View, TouchableOpacity, Image} from "react-native";
import { LogoutButton, ImprovedAlert } from '../components';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import {
    collection,
    onSnapshot,
    query, 
    doc,
    getDoc, 
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import myAvatar from '../store/myAvatar';


const ChatScreen = () => {
    const [friendList, setFriendList] = React.useState([]);
    const refresh = useSelector(state => state.refresh.refresh);

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

    const navToSearch = (item) => {
        navigation.navigate('Search');
    }

    const NoFriendDisplay = () => (
        <Layout style={styles.noFriendDisplay}>
            <Text category='s1' status='info'>
                You can only chat with friends
            </Text>
            <Button accessoryRight={searchIcon} style={styles.searchButton} onPress={navToSearch} category='p2' status='info'>
                Make friends by connecting with other users
            </Button>
        </Layout>
    )

    const ChatListDisplay = () => (
        <List
        data={friendList}
        renderItem={({ item }) => {
                const started = item.lastUpdate != null;
            return (
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Messages', {userID: item.id})} status='primary' appearance='filled'>
                <Image style={styles.image} source={{ uri: myAvatar }} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.userDisplay}>{item.id}</Text>
                    <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                </View>
                <Text style={styles.date}>{started?item.lastUpdate.toDate().toISOString().slice(0,10):null}</Text>
                </TouchableOpacity>
            );
        }}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Divider}
        />
    )

    const searchIcon = () => (
        <Icon name='corner-down-right-outline' fill='white' style={styles.searchIcon}></Icon>
    )

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
                {friendList.length == 0 ? <NoFriendDisplay/> : <ChatListDisplay/>}
                </Layout>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    rect: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center'
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
    },
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