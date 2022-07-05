import React, {useCallback} from 'react'
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    Icon,
    Button,
    Input,
    Text,
    Card,
} from '@ui-kitten/components';
import { Alert, KeyboardAvoidingView, SafeAreaView, StyleSheet, View, Keyboard} from "react-native";
import { LogoutButton, ImprovedAlert, AwaitButton } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { useNavigation, useFocusEffect, } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';
import { useEffect } from 'react';


const ProfileScreen= () => {
    const [displayNameField, setDisplayNameField] = React.useState("");
    const [emailField, setEmailField] = React.useState("");
    const [idField, setIdField] = React.useState("");
    const [connectListStr, setConnectListStr] = React.useState("");
    const [displayNameInput, setDisplayNameInput] = React.useState("");

    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};
    const currUser = auth.currentUser;
    const userDoc = doc(db, 'Users/' + currUser.uid);

    useEffect(() => {
        getDoc(userDoc).then(result => {
            setDisplayNameField(result.get('displayName'));
            setEmailField(result.get('email'));
            setIdField(result.get('id'));
        })
        const collectionPendingConnectsRef = collection(db, 'Users/' + currUser.uid + '/PendingConnects');
        const loadConnected =  async () => {
            const connectList = [];
            const qSnapshot = getDocs(collectionPendingConnectsRef);
            (await qSnapshot).forEach((doc) => {
                connectList.push(doc.get('id'));
            })
            setConnectListStr(connectList.toString());
        };
        loadConnected();
        reduxRefreshFalse();
    }, [refresh]);

    const emptyAlert = () => {
        ImprovedAlert("Display name input is empty", "Display name cannot be empty!");
    };

    const displayNameAlert = () => {
        ImprovedAlert("Display name set successful", "Display name set!");
    };

    const displayNameHandler = async () => {
        const currUser = auth.currentUser;
        const userDoc = doc(db, 'Users/' + currUser.uid);
        if (displayNameInput.length == 0) {
            emptyAlert();
        } else {
            updateDoc(userDoc, {
                "displayName" : displayNameInput,
            })
            setDisplayNameInput('');
            Keyboard.dismiss();
            displayNameAlert();
        }
    }

    const navigation = useNavigation();

    const idHeader = (props) => (
        <View {...props}>
          <Text category='h6'>User ID</Text>
        </View>
      );

    const emailHeader = (props) => (
    <View {...props}>
        <Text category='h6'>Email</Text>
    </View>
    );

    const pendingReqHeader = (props) => (
        <View {...props}>
            <Text category='h6'>Pending Connects</Text>
        </View>
    );

    return (
        <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView style={{flex:1}}>
            <TopNavigation 
                title='Profile'
                alignment='start'
                accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                accessoryRight={LogoutButton}
                style={{height:'8%'}}
            />
            <Divider/>
            <>
                <Layout style={styles.topContainer} level='1'>
                    <Input
                        style={styles.displayNameInput}
                        placeholder={"Set your display name here"}
                        onChangeText={setDisplayNameInput}/>
                    <AwaitButton awaitFunction={displayNameHandler} title={"Save Changes"} style={styles.displayNameButton}/>
                </Layout>
                <Layout style={styles.topContainer} level='1'>
                <Card status='primary' style={styles.card} header = {idHeader}>
                    <Text>{idField}</Text>
                </Card>
                <Card status='primary' style={styles.card} header = {emailHeader}>
                    <Text>{emailField}</Text>
                </Card>
                </Layout>
                <Card status='primary' style={styles.card} header = {pendingReqHeader}>
                    <Text>{connectListStr}</Text>
                </Card>
                <Layout style={styles.container} level='1'>
                <Card style={styles.card}>
                <Button onPress={() => navigation.navigate('Friends')}>
                <Text>Friend list</Text>                
                </Button>
                </Card>
                </Layout>
            </>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    topContainer: {
        backgroundColor:'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        margin: 2,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    footerControl: {
        marginHorizontal: 2,
    },
    displayNameInput: {
        width:'55%',
        margin: 5,
    },
    displayNameButton: {
        margin: 5,
    }
  });