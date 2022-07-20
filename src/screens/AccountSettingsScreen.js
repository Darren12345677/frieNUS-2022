import React from 'react'
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
import { LogoutButton, ImprovedAlert, AwaitButton, AuthTextInput, AuthPressable } from '../components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { 
    deleteUser, 
    sendEmailVerification, 
    sendPasswordResetEmail, 
    reauthenticateWithCredential, 
    signInWithEmailAndPassword, 
    EmailAuthProvider,
} from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    doc,
    deleteDoc,
} from 'firebase/firestore';


const AccountSettingsScreen = () => {
    const refresh = useSelector(state => state.refresh.refresh);
    const [visible, setVisible] = React.useState(false);
    const [password, setPassword] = React.useState("");

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

    const deleteAlert = () => {
        ImprovedAlert("User has been deleted", "User has been deleted");
    }

    const emailHandler = async () => {
        if (auth.currentUser.emailVerified == true) {
            alreadyVerifiedAlert();
        } else {
        await sendEmailVerification(auth.currentUser).catch(err => {console.log(err)});
        emailAlert();
        }
    }

    const passwordHandler = async () => {
        await sendPasswordResetEmail(auth, auth.currentUser.email).catch(err => errorHandler(err));
        passwordAlert();
    }

    const deleteHandler = async () => {
        try {
            setVisible(false);
            const userDoc = doc(db, 'Users/' + auth.currentUser.uid);
            const credential = await promptForCredentials();
            await reauthenticateWithCredential(auth.currentUser, credential);
            await deleteDoc(userDoc);
            await deleteUser(auth.currentUser);
            deleteAlert();
        } catch (err) {
            console.log(err);
            if (err.code == "auth/wrong-password") {
                ImprovedAlert("Wrong password entered for reauth", "Wrong password");
            } else {
                ImprovedAlert(err.message, err.code);
            };
        }
    }

    const errorHandler = async () => {
        console.error(err);
    }

    const promptForCredentials = async () => {
        console.log("Prompting for credentials");
        return EmailAuthProvider.credential(auth.currentUser.email, password);
    }

    const DeleteHeader = (props) => (
        <Icon name='alert-triangle-outline' fill='red' style={styles.warningIcon}></Icon>
    );

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
                <Layout level='4' style={[styles.ribbon, styles.horizontalContainer]}>
                    <Text style={styles.left} category='s1'>Verify your email</Text>
                    <Button style={[styles.button, styles.right]} onPress={emailHandler}>Send</Button>
                </Layout>
                <Layout level='4' style={[styles.ribbon, styles.horizontalContainer]}>
                    <Text style={styles.left} category='s1'>Reset your password</Text>
                    <Button style={[styles.button, styles.right]} onPress={passwordHandler}>Send</Button>
                </Layout>
                <Layout level='4' style={[styles.ribbon, styles.horizontalContainer]}>
                    <Text style={styles.left} category='s1'>Delete your account</Text>
                    <Button style={[styles.button, styles.right]} onPress={() => {setVisible(true)}}>Delete</Button>
                </Layout>
                <Modal visible={visible} onBackdropPress={() => {setVisible(false)}}>
                    <Card header={DeleteHeader} status='danger' disabled={true}>
                        <Text style={styles.cardText} category='s1'>Are you sure you want to delete your account?</Text>
                        <Text category='label' status='danger' style={styles.cardText}>This action cannot be undone!</Text>
                        <AuthTextInput textHandler={setPassword} placeholder={"Enter your password"}></AuthTextInput>
                        <AwaitButton style={styles.confirmButton} appearance='outline' status='danger' awaitFunction={deleteHandler}>Confirm</AwaitButton>
                    </Card>
                </Modal>
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
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        width:'30%',
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    confirmButton: {
        width:'75%',
        alignSelf:'center',
    },
    left: {
        flex:3,
    },
    right: {
        flex:1,
    },
    warningIcon: {
        padding:10,
        width:32,
        height:32,
        marginHorizontal:10,
        alignSelf: 'center',
    },
    cardText: {
        alignSelf:'center',
        marginBottom:10,
    },
})