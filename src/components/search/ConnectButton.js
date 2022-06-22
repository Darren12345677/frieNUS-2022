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


const ConnectButton = ({userId}) => {
    const authUserSnapshot = getDoc(doc(db, "Users/" + auth.currentUser.uid));

    const connectHandler = async () => {
        authUserSnapshot.then(result => {
            const authUserDisplayName = result.get("displayName");
            const displayStr = authUserDisplayName === userId ? "yourself" : userId;
            console.log("You connected with " + displayStr);
            console.log(auth.currentUser.uid);
            setDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectedUsers/' + userId), 
            {
                id: userId,
            }).then(res => {
                console.log("Added");
            })
        })
    }

    return (<Button onPress={connectHandler}>Connect</Button>);
};

export default ConnectButton;