import React, {useEffect} from 'react'
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
    Spinner,
} from '@ui-kitten/components';
import { Dimensions, KeyboardAvoidingView, SafeAreaView, View, ScrollView} from "react-native";
import { LogoutButton, ConnectButton, SpinnerView } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
} from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';

const UserProfileScreen= ({navigation, route}) => {
    const idField = route.params.userID
    
    const isYourself = idField === auth.currentUser.uid;
    const seeConnected = async () => {
        getDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid)).then(res => {
            res.exists() ? setConnected(true) : setConnected(false);
        })
    }

    const seeFriend = async () => {
        getDoc(doc(db, "Users/" + idField + "/Friends/" + auth.currentUser.uid)).then(res => {
            res.exists() ? setIsFriend(true) : setIsFriend(false);
        })
    }

    const [displayNameField, setDisplayNameField] = React.useState("");
    const [emailField, setEmailField] = React.useState("");
    const [connectListStr, setConnectListStr] = React.useState("");
    const [modules, setModules] = React.useState("");
    const [friends, setFriends] = React.useState("");
    const [isConnected, setConnected] = React.useState("false");
    const [isFriend, setIsFriend] = React.useState("false");
    // const [isLoading, setIsLoading] = React.useState(false);
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};
    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};

    seeConnected();
    seeFriend();

    useEffect(() => {
        const userDoc = doc(db, 'Users/' + idField);
        getDoc(userDoc).then(result => {
            setDisplayNameField(result.get('displayName'));
            setEmailField(result.get('email'));
        })
        const collectionPendingConnectsRef = collection(db, 'Users/' + idField + '/PendingConnects');
        const colRef = collection(db, 'Users/' + idField + '/Modules');
        const friendsRef = collection(db, 'Users/' + idField + '/Friends');
        const getPendingConnects =  async () => {
            const connectList = [];
            const qSnapshot = getDocs(collectionPendingConnectsRef);
            await ((await qSnapshot)).forEach((doc) => {
                connectList.push(doc.get('id'));
            })

            if (connectList.length === 0) {
                setConnectListStr("No pending connects");
            } else {
                setConnectListStr(connectList.toString());
            }
        };

        const getModules = async () => {
            const modsList = [];
            await (await getDocs(colRef)).forEach((doc) => {
                const moduleCode = doc.get('modCode');
                modsList.push(moduleCode);
            })
            
            if (modsList.length === 0) {
                setModules("Empty");
            } else {
                setModules(modsList.toString());
            }
        }

        
        const getFriends = async () => {
            const friendList = [];
            await (await getDocs(friendsRef)).forEach((doc => {
                const friendId = doc.get('id');
                friendList.push(friendId);
            }))

            if (friendList.length === 0) {
                setFriends("No friends");
            } else {
                setFriends(friendList.toString());
            }
        }
        getModules();
        getPendingConnects();
        getFriends();
        reduxRefreshFalse();
    }, [refresh, idField]);


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

    const moduleListHeader = (props) => (
        <View {...props}>
            <Text category='h6'>Modules</Text>
        </View>
    );

    const friendListHeader = (props) => (
        <View {...props}>
            <Text category='h6'>Friends</Text>
        </View>
    );

    return (
        <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView style={{flex:1}}>
            <TopNavigation 
                title='Explore'
                alignment='start'
                accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                accessoryRight={LogoutButton}
                style={{height:'8%'}}
            />
            <Divider/>
        <>
        <Layout style={{flex:1}}>
            <Layout>
                <Text category='h1' style={[styles.singleLineText]}>{isYourself ? "This is your public profile" : "Searched Profile"}</Text>
            </Layout>
            <Divider/>
            <ScrollView>
            <Layout style={styles.container} level='1'>
                <Card style={styles.card}>
                <ConnectButton isFriend={isFriend} isConnected={isConnected} isYourself={isYourself} userId={idField}/>
                </Card>
            </Layout>
            <Layout style={styles.topContainer} level='1'>
                <Card status='info' style={styles.card} header={idHeader}>
                    <Text>{idField}</Text>
                </Card>
                <Card status='info' style={styles.card} header={emailHeader}>
                    <Text>{emailField}</Text>
                </Card>
            </Layout>
            <Card status='info' style={styles.card} header={pendingReqHeader}>
                <Text>{connectListStr}</Text>
            </Card>
            <Card status='info' style={styles.card} header={moduleListHeader}>
                <Text>{modules}</Text>
            </Card>
            <Card status='info' style={styles.card} header={friendListHeader}>
                <Text>{friends}</Text>
            </Card>
            </ScrollView>
        </Layout>
        </>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default UserProfileScreen;

const styles = StyleSheet.create({
    singleLineText: {
        textAlign: 'center',
    },
    manyLineText: {
        textAlign: 'left',
    },
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
    list: {
        overflow: 'scroll',
    },
})