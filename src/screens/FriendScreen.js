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
    deleteDoc,
} from 'firebase/firestore';

const FriendScreen = () => {
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

    const disconnectHandler = async (idField) => {
        setVisible(false)
        deleteDoc(doc(db, "Users/" + idField + "/Friends/" + auth.currentUser.uid))
        deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/Friends/' + idField))
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
                                <Modal visible={visible}>
                                    <Card disabled={true}>
                                        <Layout level='2'>
                                            <Button 
                                            onPress = {() => {navigation.navigate('User Profile', {userID: item}),
                                            setVisible(false)}}>
                                                <Text>View Profile</Text>
                                            </Button>
                                        </Layout>
                                        <Divider></Divider>
                                        <Button onPress={() => setVisible(false)}>
                                            Dismiss
                                        </Button>
                                        <Divider></Divider>
                                        <Button
                                        onPress={() => disconnectHandler(item)}>
                                            <Text>Disconnect</Text>
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
        backgroundColor:'red',
        flex: 1,
        width:'100%',
    }
})