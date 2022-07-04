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
import React, { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';

import {
    doc,
    setDoc, 
    addDoc,
    collection,
} from 'firebase/firestore';

import { AuthTextInput, AuthPressable } from '../components';
import { db, auth } from '../firebase';

import { Text, Icon, Divider, Layout, TopNavigation } from '@ui-kitten/components';
import * as data from '../../app.json'
import { useDispatch } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../store/loading';
import { setRefreshTrue, } from '../store/refresh';

const AuthScreen = () => {
    
    const version = data.expo.version;
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
    const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};

    const successfulLoginAlert = () => {
        console.log("Successful Login")
        Alert.alert(
            "Login successful!",
            //This empty argument is for the captions. Otherwise app will crash when msg is displayed.
            "",
            [{ text:"Dismiss", onPress: () => console.log("Dismissed")} ]
        )
    };

    const signUpAlert = () => {
        console.log("Successful Sign Up")
        Alert.alert(
            "Sign up successfully completed!",
            //This empty argument is for the captions. Otherwise app will crash when msg is displayed.
            "",
            [{ text:"Dismiss", onPress: () => console.log("Dismissed")} ]
        )
    };

    const missingFieldsAlert = (type) => {
        console.log("Missing Fields for " + type)
        Alert.alert(
            "Missing fields for " + type + ", please try again!",
            //This empty argument is for the captions. Otherwise app will crash when msg is displayed.
            "",
            [{ text:"Dismiss", onPress: () => console.log("Dismissed")}]
        )
    };

    const errorAlert = (errorCode, errorMsg) => {
        Alert.alert(errorCode, errorMsg, 
        [{ text:"Dismiss", onPress: () => console.log("Dismissed")}])
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
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('[loginHandler]', errorCode, errorMessage);
                errorAlert(errorCode, errorMessage);
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
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('[signUpHandler]', errorCode, errorMessage);
                errorAlert(errorCode, errorMessage);
            });
        reduxRefreshTrue();
        reduxLoadingFalse();
    };

    const createUser = (user) => {
        setDoc(doc(db, 'Users', user.uid), 
            //JSON.parse(JSON.stringify(user))
            {
                "displayName" : user.uid,
                "id" : user.uid, 
                "email" : user.email,
            }
        )
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
                {/* <View style={{flex:10}}> */}
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
                {/* </View> */}
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
