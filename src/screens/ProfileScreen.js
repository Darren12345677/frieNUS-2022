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
    List,
    useTheme,
} from '@ui-kitten/components';
import { Alert, KeyboardAvoidingView, SafeAreaView, StyleSheet, View, Keyboard, ScrollView} from "react-native";
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
import { setMyName } from '../store/myName';

const ProfileScreen= () => {
    const [emailField, setEmailField] = React.useState("");
    const [idField, setIdField] = React.useState("");
    const [connectList, setConnectList] = React.useState([]);
    const theme = useTheme();

    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const myName = useSelector(state => state.myName.myName);
    const myCourse = useSelector(state => state.myCourse.myCourse);
    const myFaculty = useSelector(state => state.myFaculty.myFaculty);
    const myYear = useSelector(state => state.myYear.myYear);

    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};
    const currUser = auth.currentUser;
    const userDoc = doc(db, 'Users/' + currUser.uid);

    useEffect(() => {
        getDoc(userDoc).then(result => {
            setEmailField(result.get('email'));
            setIdField(result.get('id'));
        })
        const collectionPendingConnectsRef = collection(db, 'Users/' + currUser.uid + '/PendingConnects');
        const loadPendingConnects =  async () => {
            const arr = [];
            const qSnapshot = getDocs(collectionPendingConnectsRef);
            (await qSnapshot).forEach((doc) => {
                arr.push({id: doc.get('id')});
            })
            setConnectList([...arr]);
        };
        loadPendingConnects();
        reduxRefreshFalse();
    }, [refresh]);

    const navigation = useNavigation();

    const SettingsIcon = (props) => (
        <Icon {...props} name='settings'/>
      );
      
    const accountHeader = (props) => (
        <Layout {...props} style={styles.headerText}>
        <Text category='h6'>Account Details</Text>
        <Button 
        status='basic' 
        style={{backgroundColor:theme['background-basic-color-1']}} 
        accessoryLeft={<SettingsIcon/>}
        onPress={() => navigation.navigate('Account Settings')}    
        />
    </Layout>
      );

    const profileHeader = (props) => (
    <Layout {...props} style={styles.headerText}>
        <Text category='h6'>Profile Details</Text>
        <Button 
        status='basic' 
        style={{backgroundColor:theme['background-basic-color-1']}} 
        accessoryLeft={<SettingsIcon/>}
        onPress={() => navigation.navigate('Profile Settings')}    
        />
    </Layout>
    );

    const CardText = (props) => {
        const {leftText, rightText} = {...props}
        return (
        <Layout style={styles.cardContent}>
        <Text category='s1'>{leftText}: </Text>
        <Text category='p1'>{rightText}</Text>
        </Layout>
    );};

    const refreshHandler = async () => {
        await getDoc(userDoc);
        console.log("Refreshed");
    }

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
                <Layout style={styles.ribbon} level='4'>
                    <Text category='h5'>Welcome back</Text>
                </Layout>
                <Card disabled='true' status='primary' style={styles.card} header={accountHeader}>
                    <CardText leftText='Account ID' rightText={idField}/>
                    <CardText leftText='Email' rightText={emailField}/>
                    <CardText leftText='Account Verified' rightText={`${currUser.emailVerified}`}/>   
                </Card>
                <Card disabled='true' status='primary' style={styles.card} header={profileHeader}>
                    <CardText leftText='Display name' rightText={myName}/>
                    <CardText leftText='Faculty' rightText={myFaculty}/>
                    <CardText leftText='Course' rightText={myCourse}/>
                    <CardText leftText='Year' rightText={myYear}/>                          
                </Card>
                
                <Layout style={styles.ribbon} level='4'>
                    <Text style={styles.ribbonText} category='h5'>Your pending connects</Text>
                </Layout>
                <List style={[styles.card, {backgroundColor:theme['background-basic-color-1']}]} data={connectList} renderItem={
                    ({item}) => {
                        return (
                        <Layout level='1' style={[styles.listTextContainer, {borderColor:theme['border-basic-color-3']}]}>
                        <Text category='p1' style={styles.listText}>User ID: {item.id}</Text>
                        <Text category='label' style={styles.listText}>Name: {item.id}</Text>
                        </Layout>
                        )
                    }
                }/>
                <Layout style={styles.container} level='1'>
                    <Card style={styles.bottomCard}>
                    <Button onPress={() => navigation.navigate('Friends')}>
                    <Text>Friend list</Text>                
                    </Button>
                    </Card>
                </Layout>
                {/* <AwaitButton awaitFunction={refreshHandler}>Refreshh</AwaitButton> */}
            </>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    headerText: {
        flexDirection: 'row',
        alignItems:'center',
        paddingLeft: 20,
        justifyContent: 'space-between',
        marginBottom: -5,
    },
    listTextContainer: {
        marginLeft:10,
        marginVertical: 2,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 2,
    },
    bottomCard: {
        paddingVertical:-10,
        width:'95%',
    },
    listText: {
        paddingLeft: 5,
    },
    ribbon: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    inputContainer: {
        backgroundColor:'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topContainer: {
        backgroundColor:'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        marginVertical: 2,
        marginHorizontal: 5,
    },
    container: {
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    footerControl: {
        marginHorizontal: 2,
    },
    cardContent: {
        flexDirection: 'row',
    }
  });