import {
    StyleSheet,
    View,
    Image,
    Text,
    ToastAndroid,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';

import { AuthTextInput, AuthPressable } from '../components';
import { auth } from '../firebase';

const AuthScreen = () => {

    const versionType = 'Version 1.0.1';
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUpToast = () => {
        ToastAndroid.show(
            'Sign Up successfully completed!',
            ToastAndroid.SHORT
        );
    };

    const missingFieldsToast = () => {
        ToastAndroid.show(
            'Missing fields, please try again!',
            ToastAndroid.SHORT
        );
    };

    const loginHandler = async () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsToast();
            return;
        }

        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;

                // To show the user object returned
                console.log(user);

                restoreForm();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error('[loginHandler]', errorCode, errorMessage);
            });
    };

    const signUpHandler = async () => {
        if (email.length === 0 || password.length === 0) {
            missingFieldsToast();
            return;
        }

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;

                // To show the user object returned
                console.log(user);

                restoreForm();
                signUpToast();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error('[signUpHandler]', errorCode, errorMessage);
            });
    };

    const restoreForm = () => {
        setEmail('');
        setPassword('');
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <View style={styles.container}>
                <View style = {styles.version}>
                    <Text>{versionType}</Text>
                </View>
                <Text style={[styles.welcomeText, styles.boldText]}>
                    {`Welcome to `}
                    <Text style = {[styles.frienus]}>frieNUS!</Text>
                </Text>
                <Text style={[styles.authText, styles.boldText]}>
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
            </View>
        </KeyboardAvoidingView>
    );
};

export default AuthScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAF9F6',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boldText: {
        fontWeight: '700',
    },
    welcomeText: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 20,
        color: 'black',
        fontFamily: 'Avenir',
    },
    authText: {
        fontSize: 20,
        marginBottom: 10,
    },
    version: {
        position: 'absolute',
        bottom: 20,
        right: 10,
    },
    frienus: {
        color: 'orange',
    },
});
