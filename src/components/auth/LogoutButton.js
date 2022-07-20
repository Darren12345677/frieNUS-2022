import {
    TouchableOpacity,
    Alert,
} from 'react-native';
import React from 'react';

import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../../firebase';
import { useDispatch } from 'react-redux';
import { setMyName } from '../../store/myName';
import { setMyCourse } from '../../store/myCourse';
import { setMyFaculty } from '../../store/myFaculty';
import { setMyYear } from '../../store/myYear';
import { setMyAvatar } from '../../store/myAvatar';

const successfulLogoutAlert = () => {
    console.log("Successful Logout")
    Alert.alert(
        "Logged out!",
        //This empty argument is for the captions. Otherwise app will crash when msg is displayed.
        "",
        [{ text:"Dismiss", onPress: () => console.log("Dismissed")} ]
    )
};

const LogoutButton = () => {
    const dispatch = useDispatch();
    const reduxSetMyName = (name) => {dispatch(setMyName({input: name})); };
    const reduxSetMyCourse = (course) => {dispatch(setMyCourse({input: course}));};
    const reduxSetMyFaculty = (faculty) => {dispatch(setMyFaculty({input: faculty}));};
    const reduxSetMyYear = (year) => {dispatch(setMyYear({input: year}));};
    const reduxSetMyAvatar = (avatarLink) => {dispatch(setMyAvatar({input: avatarLink}));};

    const logoutHandler = () => {
        //Cleanup
        reduxSetMyName("NIL");
        reduxSetMyCourse("NIL");
        reduxSetMyFaculty("NIL");
        reduxSetMyAvatar("https://reactjs.org/logo-og.png");
        reduxSetMyYear(1);

        signOut(auth).then(() => {
            //This alert must be done before the hook or else it will not display
            successfulLogoutAlert();
            // setIsAuth(false);
        });
    };

    return (
    <TouchableOpacity onPress={logoutHandler}>
        <MaterialIcons name="logout" size={28} color="#6696ff" />
    </TouchableOpacity>
    );
};

export default LogoutButton;