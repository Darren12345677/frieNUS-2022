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
    BottomNavigation, 
    BottomNavigationTab,
    Card,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View} from "react-native";
import { LogoutButton, UserResult, ConnectButton } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    getDocs,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useNavigation, useFocusEffect, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabNavigator } from '../navigation';
import { ScrollView } from 'react-native-gesture-handler';


const ProfileScreen= () => {
    const [displayNameField, setDisplayNameField] = React.useState("");
    const [emailField, setEmailField] = React.useState("");
    const [idField, setIdField] = React.useState("");
    const [connectListStr, setConnectListStr] = React.useState("");

    useFocusEffect(() => {
        const currUser = auth.currentUser;
        const userDoc = doc(db, 'Users/' + currUser.uid);
        getDoc(userDoc).then(result => {
            console.log("This is the currentUser id: " + currUser.uid);
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
    })

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
            {/* <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text category='h1'>Profile</Text>
            <Button onPress={() => navigation.navigate('Friends')}>
                <Text>Friends</Text>                
            </Button>
            <Text>This is your current uid: {idField}</Text>
            <Text>Your email is now: {emailField} </Text>
            <Text>Your display name is: {displayNameField} </Text>
            <Text>These are the users you have requested to connected with: {connectListStr} </Text> 
            </Layout> */}   
            <React.Fragment>
                <Layout style={styles.topContainer} level='1'>

                <Card style={styles.card} header = {idHeader}>
                    <Text>{idField}</Text>
                </Card>

                <Card style={styles.card} header = {emailHeader}>
                    <Text>{emailField}</Text>
                </Card>

                </Layout>
                <Card style={styles.card} header = {pendingReqHeader}>
                <Text>
                    {connectListStr}
                </Text>
                </Card>
                <Layout style={styles.container} level='1'>
                <Card style={styles.card}>
                <Button onPress={() => navigation.navigate('Friends')}>
                <Text>Friend list</Text>                
                </Button>
                </Card>
                </Layout>
                <Divider></Divider>
            </React.Fragment>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    topContainer: {
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
  });