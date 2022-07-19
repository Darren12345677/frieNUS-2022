import React, {useCallback} from 'react'
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Button,
    Input,
    Text,
    Card,
    Modal,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet} from "react-native";
import { LogoutButton, ImprovedAlert, AwaitButton } from '../components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { getAuth, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const AccountSettingsScreen = () => {
    const refresh = useSelector(state => state.refresh.refresh);

    useEffect(() => {
    }, [refresh]);

    const alreadyVerifiedAlert = () => {
        ImprovedAlert("Email already verified", "Your account has already been verified");
    };

    const emailAlert = () => {
        ImprovedAlert("Verification Email Sent", "Sent email for verification");
    };

    const passwordAlert = () => {
        ImprovedAlert("Password Reset Email Sent", "Sent email for password reset");
    };

    const emailHandler = async () => {
        if (auth.currentUser.emailVerified == true) {
            alreadyVerifiedAlert();
        } else {
        await sendEmailVerification(auth.currentUser).catch(err => {console.log(err)});
        emailAlert();
        }
    }

    const passwordHandler = async () => {
        await sendPasswordResetEmail(auth, auth.currentUser.email).catch(err => {console.log(err)});
        passwordAlert();
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView style={{flex:1}}>
                <TopNavigation 
                title='Account Settings'
                alignment='start'
                accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                accessoryRight={LogoutButton}
                style={{height:'8%'}}
                />
                <Divider/>
                <Layout level='2' style={styles.screen}>
                <Layout level='4' style={styles.ribbon}>
                    <Text category='s1'>Verify your email</Text>
                </Layout>
                <Layout level='1' style={[styles.container]}>
                    <Button style={styles.button} onPress={emailHandler}>Send</Button>
                </Layout>
                <Layout level='4' style={styles.ribbon}>
                    <Text category='s1'>Reset your password</Text>
                </Layout>
                <Layout level='1' style={[styles.container]}>
                    <Button style={styles.button} onPress={passwordHandler}>Send</Button>
                </Layout>
                </Layout>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AccountSettingsScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width:'100%',
    },
    ribbon: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        marginVertical: 10,
    },
    container: {
        marginHorizontal: 5,
        marginVertical: 10,
    },
    button: {
        width:'30%',
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
})