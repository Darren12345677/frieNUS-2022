import React from 'react';
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    Icon,
    Button,
    Avatar,
    Text,
    Card,
    List,
    useTheme,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, ScrollView} from "react-native";
import { LogoutButton, AwaitButton } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    deleteDoc,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshFalse } from '../store/refresh';
import { useEffect } from 'react';

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
    const myAvatar = useSelector(state => state.myAvatar.myAvatar);

    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};
    const currUser = auth.currentUser;
    const userDoc = doc(db, 'Users/' + currUser.uid);

    useEffect(() => {
        getDoc(userDoc).then(result => {
            setEmailField(result.get('email'));
            setIdField(result.get('id'));
        })
        const collectionPendingConnectsRef = collection(db, 'Users/' + currUser.uid + '/PendingConnects');
        
        const arr = [];
        const qSnapshot = getDocs(collectionPendingConnectsRef);
        console.log("Got qsnapshot");

        qSnapshot.then(snapshot => {
            let curr = 0;
            for (const document of snapshot.docs) {
                getDoc(doc(db, 'Users/' + document.get('id'))).then(userDocument => {
                    if (userDocument.exists()) {
                        arr.push({id: document.get('id')});
                        curr += 1;
                    } else {
                        deleteDoc(doc(db, 'Users/' + currUser.uid + '/PendingConnects/' + document.get('id')));
                        curr += 1;
                    }
                    if (curr == snapshot.docs.length) {
                        setConnectList([...arr]);
                    }
                });
            }
        });
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

    const DisplayNoConnects = () => (
        <Text style={styles.noConnects}>You have no pending connects yet</Text>
    );

    const DisplayConnectList = () => (
        <List style={[styles.list, {backgroundColor:theme['background-basic-color-1']}]} data={connectList} renderItem={
            ({item}) => {
                return (
                <Layout level='1' style={[styles.listTextContainer, {borderColor:theme['border-basic-color-3']}]}>
                <Text category='p1' style={styles.listText}>User ID: {item.id}</Text>
                {/* <Text category='label' style={styles.listText}>Name: {item.id}</Text> */}
                </Layout>
                )}} 
        />
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
            <ScrollView>
                <Layout style={styles.topContainer}>
                    <Avatar defaultSource={require('../assets/image-outline.png')} shape='round' source={{uri: myAvatar}} style={styles.image}/>
                    <Text style={styles.topText} category='h5' status='primary'
                    children={
`Welcome back, 
    ${myName}`}/>
                    <AwaitButton 
                    appearance='ghost'
                    status='basic'
                    style={styles.refresh} 
                    accessoryLeft={<Icon style={styles.refreshIcon} name='refresh-outline'/>} 
                    awaitFunction={refreshHandler}/>
                </Layout>
                <Layout style={styles.ribbon} level='4'>
                    <Text category='h5'>Details</Text>
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
                <Layout level='1' style={styles.container}>
                {connectList.length == 0 ? <DisplayNoConnects/> : <DisplayConnectList/>}
                </Layout>
                <Layout style={styles.container} level='1'>
                    <Card style={styles.bottomCard}>
                    <Button onPress={() => navigation.navigate('Friends')}>
                        <Text>Friend list</Text>                
                    </Button>
                    </Card>
                </Layout>
            </ScrollView>
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
        marginVertical:5,
    },
    inputContainer: {
        backgroundColor:'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topContainer: {
        backgroundColor:'white',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems:'center',
        paddingLeft:30,
        paddingVertical:20,
    },
    topText: {
        marginLeft:30,
    },
    card: {
        marginVertical: 2,
        marginHorizontal: 5,
    },
    list: {
        marginVertical: 10,
        marginHorizontal: 5,
        paddingVertical: 10,
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
    },
    image: {
        width:75,
        height:75,
    },
    noConnects: {
        paddingVertical:40,  
    },
    refresh: {
        marginLeft:20,
    },
  });