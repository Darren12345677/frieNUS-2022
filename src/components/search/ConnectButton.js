import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button, Card, Layout, Modal, Divider } from '@ui-kitten/components';
import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    getDoc,
    doc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useEffect } from 'react';


const ConnectButton = ({isYourself, userId}) => {
    const authUserSnapshot = getDoc(doc(db, "Users/" + auth.currentUser.uid));
    const currUserSnapshot = getDoc(doc(db, "Users/" + userId + "/PendingConnects/" + auth.currentUser.uid));
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
                console.log("We have found friends!");
            } else {
                console.log("These 2 are not friends :(");
            }
        })

        
    }

    return (<Button disabled={isYourself} onPress={connectHandler}>Connect</Button>);
};

export default ConnectButton;