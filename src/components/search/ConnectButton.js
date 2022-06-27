import { Alert, StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button, Card, Layout, Modal, Divider } from '@ui-kitten/components';
import {
    setDoc,
    getDoc,
    doc,
    deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';


const ConnectButton = ({isConnected, isYourself, isFriend, userId}) => {
    // console.log(isConnected);
    const authUserSnapshot = getDoc(doc(db, "Users/" + auth.currentUser.uid));
    const currUserSnapshot = getDoc(doc(db, "Users/" + userId + "/PendingConnects/" + auth.currentUser.uid));
    const currUserFriendsSnapshot = getDoc(doc(db, "Users/" + userId + "/Friends/" + auth.currentUser.uid));
    
    const displayTitle = () => {
        console.log("isDisabled is " + isYourself);
        if (isFriend) {
            return "You are already friends with this user";
        } else if (!isYourself && isConnected) {
            return "This user wants to connect with you";
        } else if (isYourself) {
            return "You cannot connect with yourself";
        } else {
            return "Connect";
        }
    }

    const shouldDisable = () => { 
        if (isFriend) {
            return true;
        } else if (isYourself) {
            return true;
        } else if (!isYourself && isConnected) {
            return true;
        } else {
            return false;
        }
    }

    const successfulConnectAlert = () => {
        console.log("Successful Connect");
        Alert.alert(
            "Successful Connect",
            "",
            [{text:"Dismiss", onPress: () => console.log("Dismissed")}]
        )
    }
    
    const connectHandler = async () => {
        authUserSnapshot.then(result => {
            const authUserDisplayName = result.get("displayName");
            const displayStr = authUserDisplayName === userId ? "yourself" : userId;
            console.log("You connected with " + displayStr);
            console.log(auth.currentUser.uid);
            setDoc(doc(db, 'Users/' + auth.currentUser.uid + '/PendingConnects/' + userId), 
            {
                id: userId,
            }).then(res => {
                console.log("Added");
                checkFriends("hi");
                successfulConnectAlert();
            })
        })
    }

    const checkFriends = async (hello) => {
        console.log("connectHandler ends, check starts and we say " + hello)
        //When connectHandler runs, authUser adds currUser into its PendingConnects,
        //so now we only need to check if authUser is in currUser's PendingConnects!
        //Check if authUser is in currUser's PendingConnects

        currUserSnapshot.then(result => {
            if (result.exists()) {
                setDoc(doc(db, 'Users/'+ auth.currentUser.uid + '/Friends/' + userId), {
                    id: userId,
                })
                setDoc(doc(db, 'Users/'+ userId + '/Friends/' + auth.currentUser.uid), {
                    id: auth.currentUser.uid,
                })
                deleteDoc(doc(db, "Users/" + userId + "/PendingConnects/" + auth.currentUser.uid))
                deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/PendingConnects/' + userId))
                deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + userId))
                console.log("We have found friends!");
            } else  {
                currUserFriendsSnapshot.then(result => {
                    if (result.exists()) {
                        deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/PendingConnects/' + userId))
                    } else {
                        setDoc(doc(db, 'Users/' + userId + '/ConnectNotif/' + auth.currentUser.uid),
                        {
                            id: auth.currentUser.uid,
                        })
                        console.log("These 2 are not friends :(");
                    }
                })
            }
        })
    }

    return (<Button disabled={shouldDisable()} onPress={connectHandler}>{displayTitle()}</Button>);
};

export default ConnectButton;