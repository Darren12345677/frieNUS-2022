import {
    StyleSheet,
    View,
    Text,
    Image,
    ToastAndroid,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';

import { AuthTextInput, AuthPressable } from '../components';
import { auth } from '../firebase';

import { Button, Divider, Layout, TopNavigation, List } from '@ui-kitten/components';

const FacebookIcon = (props) => (
    <Icon name='facebook' {...props} />
);

const FacebookIconOutline = (props) => (
    <Icon name='facebook-outline' {...props} />
);

const AuthScreen = () => {
    const versionType = 'Version 1.0.2.Test';
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

    const FrieNUSLogo = () => {
        return(
            <TouchableOpacity>
                <Image source={require('../assets/logofrienus.png')} style={styles.logo} />
            </TouchableOpacity>);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <TopNavigation 
                title='Authentication' 
                alignment='center'
                />
            <Divider/>
            <Layout style={[styles.container]} level='1'>
                <View style = {styles.version}>
                    <Text appearance='hint'>{versionType}</Text>
                </View>
                <Text category='h1' style={[styles.boldText, styles.welcomeText]}>
                    {`Welcome to `}
                    <Text category='h1' style = {[styles.frienus]}>frieNUS!</Text>
                </Text>
                <Text category='h5' style={[styles.authText, styles.boldText]}>
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
            </Layout>
        </KeyboardAvoidingView>
    );
};

export default AuthScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boldText: {
        fontWeight: '700',
    },
    welcomeText: {
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'Avenir',
    },
    authText: {
        marginBottom: 20,
    },
    version: {
        position: 'absolute',
        bottom: 20,
        right: 10,
    },
    frienus: {
        fontSize: 32,
        color: 'orange',
    },
});
