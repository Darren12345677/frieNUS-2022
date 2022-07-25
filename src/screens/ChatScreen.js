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
    Card
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View, TouchableOpacity, Image} from "react-native";
import { LogoutButton, ImprovedAlert, ChatItem } from '../components';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth, db } from '../firebase';
import {
    collection,
    onSnapshot,
    query, 
    doc,
    getDoc, 
    orderBy
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import myAvatar from '../store/myAvatar';


const ChatScreen = () => {
    const [friendList, setFriendList] = React.useState([]);
    const refresh = useSelector(state => state.refresh.refresh);
    const isFocus = useIsFocused();

    useEffect(() => {
        console.log('check')
        const friendQuery = query(collection(db, 'Users/' + auth.currentUser.uid + '/Friends'), orderBy('lastUpdate', 'desc'));
        const unsubscribe = onSnapshot(friendQuery, (snapshot) => {
            const friends = [];     
            snapshot.forEach((doc) => {
                friends.push({ id: doc.id, ...doc.data() });
            });
            setFriendList([...friends]);
        });
        return unsubscribe;
    }, []);

    const navigation = useNavigation();

    const NoFriendDisplay = () => (
        <Layout style={styles.noFriendDisplay}>
            <Text category='s1' status='info'>
                Start a chat with your friends!
            </Text>
            {/* <Button accessoryRight={searchIcon} style={styles.searchButton} onPress={navToSearch} category='p2' status='info'>
                Make friends by connecting with other users
            </Button> */}
        </Layout>
    )

    const ChatListDisplay = () => (
        <List
        data={friendList}
        renderItem={({ item }) => {
            return (
                <ChatItem item = {item} />
            );
        }}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Divider}
        />
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
                <Card style={styles.bottomCard}>
                    <Button onPress={() => navigation.navigate('Friends')}
                    appearance='outline'
                    size='small'
                    status='basic'
                    accessoryRight={<Icon name='person-done-outline' pack='eva'/>}>
                    Friends            
                    </Button>
                    </Card>
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
    bottomCard: {
        paddingVertical:-10,
    },
    searchIcon: {
        width:20,
        height:20,
        marginHorizontal:10,
    }
})