import {
    StyleSheet,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Alert,
    SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';

import {
    doc,
    setDoc, 
} from 'firebase/firestore';

import { AuthTextInput, AuthPressable } from '../components';
import { db, auth } from '../firebase';

import { Text, Icon, Divider, Layout, TopNavigation } from '@ui-kitten/components';
import * as data from '../../app.json'

const AuthScreen = () => {
    const version = data.expo.version;
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                // To show the user object returned
                console.log(user);
                restoreForm();
                successfulLoginAlert();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('[loginHandler]', errorCode, errorMessage);
                errorAlert(errorCode, errorMessage);
            });
    };

    const signUpHandler = async () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsAlert("sign up");
            return;
        }

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
    };

    const createUser = (user) => {
        console.log("This is the user");
        return setDoc(doc(db, 'Users', user.uid), 
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
                <TopNavigation 
                    title='Authentication'
                    alignment='start'
                    accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, width:60, height:60}} />}
                    style={{flex:0.025}}
                />
                <Divider/>
                <Layout style={[styles.content]}>
                    <Text category='h2' style={[styles.welcomeText]}>
                        {`Welcome to `}
                        <Text category='h1' style = {{color:'orange'}}>frieNUS!</Text>
                    </Text>
                    <Text status='basic' category='h5' style={[styles.authText]}>
                        {isLogin ? 'Login!' : 'Sign up!'}
                    </Text>
                    <AuthTextInput
                        value={email}
                        placeholder="Your Email"
                        textHandler={setEmail}
                        keyboardType="email-address"
                    />
                    <AuthTextInput
                        value={password}
                        placeholder="Your Password"
                        textHandler={setPassword}
                        secureTextEntry
                    />
                    <AuthPressable
                        onPressHandler={isLogin ? loginHandler : signUpHandler}
                        title={'Proceed'}
                    />
                    <AuthPressable
                        onPressHandler={() => setIsLogin(!isLogin)}
                        title={`Switch to ${isLogin ? 'Sign Up' : 'Login'}`}
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
        // backgroundColor:'red',
        flex: 10,
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
        fontSize: 30,
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
