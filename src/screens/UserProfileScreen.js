import React, {useEffect} from 'react'
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    Icon,
    Text,
    Card,
    Avatar,
} from '@ui-kitten/components';
import { Dimensions, KeyboardAvoidingView, SafeAreaView, View, ScrollView} from "react-native";
import { LogoutButton, ConnectButton } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
} from 'firebase/firestore';
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
        if (idField == auth.currentUser.uid) {
            setIsFriend(true);
        } else {
            getDoc(doc(db, "Users/" + idField + "/Friends/" + auth.currentUser.uid)).then(res => {
                res.exists() ? setIsFriend(true) : setIsFriend(false);
            })
        }
    }

    const [displayNameField, setDisplayNameField] = React.useState("");
    const [emailField, setEmailField] = React.useState("");
    const [faculty, setFaculty] = React.useState("");
    const [year, setYear] = React.useState(5);
    const [course, setCourse] = React.useState("");
    const [avatar, setAvatar] = React.useState("");
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

    // seeConnected();
    // seeFriend();

    useEffect(() => {
        seeConnected();
        seeFriend();
        const userDoc = doc(db, 'Users/' + idField);
        getDoc(userDoc).then(result => {
            setDisplayNameField(result.get('name'));
            setEmailField(result.get('email'));
            setCourse(result.get('course'));
            setYear(result.get('year'));
            setAvatar(result.get('avatar'));
            setFaculty(result.get('faculty'));
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
            const q = query(colRef, orderBy("rank"));
            const modsList = [];
            await (await getDocs(q)).forEach((doc) => {
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

    const Header = (props) => {
        const {headerText} = {...props}
        return (
        <View {...props}>
          <Text category='h6'>{headerText}</Text>
        </View>);
    };
    
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
                title={<Text category='h1' style={[styles.singleLineText]}>{isYourself ? "This is your public profile" : "Explore"}</Text>}
                alignment='start'
                accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                accessoryRight={LogoutButton}
                style={{height:'8%'}}
            />
            <Divider/>
        <>
        <Layout style={{flex:1}}>
            <Divider/>
            <ScrollView>
            <Avatar defaultSource={require('../assets/image-outline.png')} shape='round' source={{uri: avatar}} style={styles.image}/>
            <Layout style={styles.container} level='1'>
                <Card style={styles.card}>
                <ConnectButton isFriend={isFriend} isConnected={isConnected} isYourself={isYourself} userId={idField}/>
                </Card>
            </Layout>
            <Layout style={styles.topContainer} level='1'>
                <Card status='info' style={styles.card} header={<Header headerText={'User ID'}/>}>
                    <Text>{idField}</Text>
                </Card>
                <Card status='info' style={styles.card} header={<Header headerText={'Year'}/>}>
                    <Text>{year}</Text>
                </Card>
            </Layout>
            <Layout style={styles.topContainer} level='1'>
                <Card status='info' style={styles.card} header={<Header headerText={'Email'}/>}>
                    <Text>{isFriend ? emailField : "You need to be friends with this user"}</Text>
                </Card>
                <Card status='info' style={styles.card} header={<Header headerText={'Display Name'}/>}>
                    <Text>{isFriend ? displayNameField : "You need to be friends with this user"}</Text>
                </Card>
            </Layout>
            <Layout style={styles.topContainer} level='1'>
                <Card status='info' style={styles.card} header={<Header headerText={'Course'}/>}>
                    <Text>{faculty}</Text>
                </Card>
                <Card status='info' style={styles.card} header={<Header headerText={'Faculty'}/>}>
                    <Text>{course}</Text>
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
        marginVertical: 5,
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
    image: {
        alignSelf:'center',
        width:75,
        height:75,
        marginBottom:10,
    },
})