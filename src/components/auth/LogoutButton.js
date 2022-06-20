import {
    TouchableOpacity,
    Alert,
} from 'react-native';
import React from 'react';

import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../../firebase';

const successfulLogoutAlert = () => {
    console.log("Successful Logout")
    Alert.alert(
        "Logged out!",
        //This empty argument is for the captions. Otherwise app will crash when msg is displayed.
        "",
        [{ text:"Dismiss", onPress: () => console.log("Dismissed")} ]
    )
};

const logoutHandler = () => {
    signOut(auth).then(() => {
        //This alert must be done before the hook or else it will not display
        successfulLogoutAlert();
        // setIsAuth(false);
    });
};

const LogoutButton = () => (
    <TouchableOpacity onPress={logoutHandler}>
        <MaterialIcons name="logout" size={28} color="#6696ff" />
    </TouchableOpacity>
);

export default LogoutButton;