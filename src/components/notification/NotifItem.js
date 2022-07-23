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
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View} from "react-native";
import { LogoutButton, ImprovedAlert, AwaitButton } from '../../components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../../firebase';
import {
    collection,
    doc,
    deleteDoc,
    onSnapshot,
    query, 
    getDoc,
    setDoc
} from 'firebase/firestore';
import { useEffect } from 'react';

const NotifItem = ({item}) => {
    const navigation = useNavigation();
    const [userItem, setUserItem] = React.useState(item.id);
    const [userDisplay, setUserDisplay] = React.useState(item.id);

    useEffect(() => {
        const userDoc = doc(db, 'Users/' + item.id);
        const setCurrUser = () => {
            getDoc(userDoc).then(result => {
                if (result.get('name') != 'Not selected') {
                    setUserDisplay(result.get('name'));
                }
            })
        }
        setCurrUser();
    }, [])

    const successfulAcceptAlert = () => {
        ImprovedAlert("Successful Accept", "Added new friend!");
    }


    const successfulDeclineAlert = () => {
        ImprovedAlert("Successful Decline", "Declined connect request");
    }

    const acceptHandler = async (idField) => {
        await setDoc(doc(db, 'Users/'+ auth.currentUser.uid + '/Friends/' + idField), {
            id: idField,
        })
        await setDoc(doc(db, 'Users/'+ idField + '/Friends/' + auth.currentUser.uid), {
            id: auth.currentUser.uid,
        })
        await deleteDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid))
        await deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + idField))
        successfulAcceptAlert();
    }

    const declineHandler = async (idField) => {
        await (deleteDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid)));
        await (deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + idField)));
        successfulDeclineAlert();
    }

    const Footer = (props) => (
        <View {...props} style={[props.style, styles.footerContainer]}>
       <AwaitButton awaitFunction={()=>acceptHandler(userItem)}
        style={styles.footerControl}
        status='success'
        size='small'
        accessoryRight={<Icon name='checkmark-outline' pack='eva'/>}>
        Accept
        </AwaitButton>
        <AwaitButton awaitFunction={()=>declineHandler(userItem)}
        style={styles.footerControl}
        size='small'
        status='danger'
        accessoryRight={<Icon name='close-outline' pack='eva'/>}>
        Decline
        </AwaitButton>
        </View>
      );

    return (        
        <Layout>
        <Card onPress = {() => {
            console.log(userItem);
            navigation.navigate('User Profile', {userID: userItem})
            }} status='basic' appearance='outline' 
            style={styles.rect} footer={Footer}>
            <Text category='s1' appearance='default'>{userDisplay}</Text>
        </Card>
        </Layout>
        )
}

export default NotifItem;

const styles = StyleSheet.create({
    rect: {
        marginVertical: 5,
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
    disconnectButton: {
        margin:0,
    },
    searchIcon: {
        width:20,
        height:20,
        marginHorizontal:10,
    }, 
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
    footerControl: {
        marginHorizontal: 2,
    },
})