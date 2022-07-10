import React from 'react';
import {
    setDoc,
    getDoc,
    doc,
    deleteDoc,
} from 'firebase/firestore';
import { ImprovedAlert, AwaitButton } from '../../components';
import { auth, db } from '../../firebase';


const ConnectButton = ({isConnected, isYourself, isFriend, userId}) => {
    const authUserSnapshot = getDoc(doc(db, "Users/" + auth.currentUser.uid));
    const currUserSnapshot = getDoc(doc(db, "Users/" + userId + "/PendingConnects/" + auth.currentUser.uid));
    const currUserFriendsSnapshot = getDoc(doc(db, "Users/" + userId + "/Friends/" + auth.currentUser.uid));

    const displayTitle = () => {
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
        ImprovedAlert("Successful Connect", "Successful Connect");
    };

    const connecter = async () => {
        const ss = await authUserSnapshot;
        const authUserDisplayName = ss.get("displayName");
        const displayStr = authUserDisplayName === userId ? "yourself" : userId;
        await setDoc(doc(db, 'Users/' + auth.currentUser.uid + '/PendingConnects/' + userId), 
        {id: userId,})
        await checkFriends();
        successfulConnectAlert();
        // console.log("Friends checked");
    }

    const checkFriends = async () => {
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
            } else  {
                currUserFriendsSnapshot.then(result => {
                    if (result.exists()) {
                        deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/PendingConnects/' + userId))
                    } else {
                        setDoc(doc(db, 'Users/' + userId + '/ConnectNotif/' + auth.currentUser.uid),
                        {
                            id: auth.currentUser.uid,
                        })
                    }
                })
            }
        })
    }

    return (
        <AwaitButton 
            disabled={shouldDisable()} 
            children={displayTitle()} 
            awaitFunction={connecter}
        ></AwaitButton>
    );
};

export default ConnectButton;