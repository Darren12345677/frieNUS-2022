import {
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
    View,
    Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
} from 'firebase/auth';

import {
    doc,
    setDoc, 
    addDoc,
    collection,
    getDoc,
} from 'firebase/firestore';

import { AuthTextInput, AuthPressable, ImprovedAlert } from '../components';
import { db, auth } from '../firebase';


import { Text, Icon, Divider, Layout, TopNavigation, Button } from '@ui-kitten/components';
import * as data from '../../app.json'
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../store/loading';
import { setRefreshTrue, } from '../store/refresh';
import { setMyName } from '../store/myName';
import { setMyCourse } from '../store/myCourse';
import { setMyFaculty } from '../store/myFaculty';
import { setMyYear } from '../store/myYear';

const AuthScreen = () => {
    const version = data.expo.version;
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [name, setName] = useState("");
    // const [course, setCourse] = useState("");
    // const [faculty, setFaculty] = useState("");
    // const [year, setYear] = useState(1);
    const myName = useSelector(state => state.myName.myName);
    const dispatch = useDispatch();
    const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
    const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};
    const reduxSetMyName = (name) => {dispatch(setMyName({input: name})); };
    const reduxSetMyCourse = (course) => {dispatch(setMyCourse({input: course}));};
    const reduxSetMyFaculty = (faculty) => {dispatch(setMyFaculty({input: faculty}));};
    const reduxSetMyYear = (year) => {dispatch(setMyYear({input: year}));};

    // useEffect(() => {
    //     console.log("name has been set");
    // }, [setName]);

    const successfulLoginAlert = () => {
        ImprovedAlert("Successful Login","Login successful!");
    };

    const missingFieldsAlert = (type) => {
        ImprovedAlert("Missing Fields for " + type, "Missing fields for " + type + ", please try again!");
    };

    const signUpAlert = () => {
        ImprovedAlert("Successful Sign Up", "Account created!");
    };

    const errorAlert = (errorCode, errorMsg) => {
        console.log("This is the error code: " + errorCode);
        console.log("This is the error msg: " + errorMsg);
        ImprovedAlert("Encountered an error", errorMsg);
    }

    const loginHandler = async () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsAlert("login");
            return;
        }
        reduxLoadingTrue();
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                // To show the user object returned
                // console.log(user);
                restoreForm();
                successfulLoginAlert();
                //redux actions to set state
                getDoc(doc(db, 'Users/' + auth.currentUser.uid)).then(res => {
                    const newName = res.get('name');
                    const newFac = res.get('faculty');
                    const newCourse = res.get('course');
                    const newYear = res.get('year');
                    reduxSetMyName(newName);
                    reduxSetMyFaculty(newFac);
                    reduxSetMyCourse(newCourse);
                    reduxSetMyYear(newYear);
                    // console.log('Done');
                })
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // console.error('[loginHandler]', errorCode, errorMessage);
                if (errorCode == "auth/invalid-email") {
                    errorAlert(errorMessage, "Invalid email");
                } else if (errorCode == "auth/wrong-password") {
                    errorAlert(errorMessage, "Wrong password");
                } else if (errorCode == "auth/user-not-found") {
                    errorAlert(errorMessage, "User does not exist");
                } else {
                    errorAlert(errorCode, errorMessage);
                };
            });
        reduxRefreshTrue();
        reduxLoadingFalse();
    };

    const signUpHandler = async () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsAlert("sign up");
            return;
        }
        reduxLoadingTrue();
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                // To show the user object returned
                console.log(user);
                restoreForm();
                signUpAlert();
                createUser(user);
                //redux actions to set state
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // console.error('[signUpHandler]', errorCode, errorMessage);
                if (errorCode == "auth/invalid-email") {
                    errorAlert(errorMessage, "Invalid email");
                } else if (errorCode == "auth/email-already-in-use") {
                    errorAlert(errorMessage, "User already exists")
                } else {
                    errorAlert(errorCode, errorMessage);
                };
            });
        reduxRefreshTrue();
        reduxLoadingFalse();
    };

    const createUser = (user) => {
        setDoc(doc(db, 'Users', user.uid), 
            //JSON.parse(JSON.stringify(user))
            {
                "id" : user.uid, 
                "email" : user.email,
                "name" : "Not selected",
                "faculty": "Not selected",
                "course": "Not selected",
                "year": 1,
            }
        ).then(res => {
            reduxSetMyName("Not selected");
            reduxSetMyFaculty("Not selected");
            reduxSetMyCourse("Not selected");
            reduxSetMyYear(1);
            console.log("New user made");
        }).catch(err => {
            console.log("Error in createUser function")
        })
    }

    const restoreForm = () => {
        setEmail('');
        setPassword('');
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={{flex:1}}>
          <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? null : null}
            >
                <Divider/>
                <Layout style={{flex:0.075, paddingBottom:'5%'}}>
                    <Layout style={{backgroundColor:'#FF6721', flex:1, justifyContent:'center', alignItems:'center'}}>
                        <Text appearance='alternative' category='s1' style={{fontFamily:'Avenir'}}>Make friends with frieNUS!</Text>
                    </Layout>
                </Layout>
                <Layout style={[styles.content]}>
                <Image source={require("../assets/frienus.png")} style={{height:'20%', width:'30%', marginBottom:'2.5%', marginTop:'-5%', resizeMode:'cover'}}/>
                    <Text status='basic' category='h4' style={[styles.authText]}>
                        {isLogin ? 'Login to frieNUS' : 'Create an account on frieNUS'}
                    </Text>
                    <AuthTextInput
                        value={email}
                        placeholder="Your email address"
                        textHandler={setEmail}
                        keyboardType="email-address"
                    />
                    <AuthTextInput
                        value={password}
                        placeholder="Your password"
                        textHandler={setPassword}
                        secureTextEntry
                    />
                    <AuthPressable
                        onPressHandler={isLogin ? loginHandler : signUpHandler}
                        title={isLogin ? 'Login' : 'Create an account'}
                        iconLeft={isLogin ? <Icon name='unlock'/> : <Icon name='plus'/>}
                    />
                    <AuthPressable
                        onPressHandler={() => setIsLogin(!isLogin)}
                        title={`Switch to ${isLogin ? 'Sign Up Screen' : 'Login Screen'}`}
                        iconLeft={isLogin ? <Icon name='plus'/> : <Icon name='unlock'/>}
                    />
                    <Text style = {styles.version} appearance='hint'>Version {version}</Text>
                </Layout>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AuthScreen;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
    },
    welcomeText: {
        textAlign: 'center',
        marginBottom: 20,
        marginTop: '10%',
        fontFamily: 'Avenir',
    },
    authText: {
        marginBottom: 30,
        // fontSize: 30,
        textAlign:'left'
    },
    version: {
        position: 'absolute',
        bottom: 20,
        right: 10,
    },
    logo: {
        width: 50,
        resizeMode: 'contain',
    }
});
