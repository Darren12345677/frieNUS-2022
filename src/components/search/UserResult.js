import { StyleSheet } from 'react-native';
import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, Button, Card, Layout, Modal, Divider } from '@ui-kitten/components';
import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    getDoc,
    doc,
    deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import ConnectButton from './ConnectButton';
import NotificationScreen, * as NotifScreen from '../../screens/NotificationScreen';


const UserResult = ({keyId, userFields}) => {
    const idField = userFields;
    const [visible, setVisible] = React.useState(false);
    const [finalStr, setStr] = React.useState("");
    const [status, setStatus] = React.useState("primary");

    useFocusEffect(() => {
        const colRef = collection(db, 'Users/' + idField + '/Modules');
        const getModules = async () => {
            const modsList = [];
            await (await getDocs(colRef)).forEach((doc) => {
                const moduleCode = doc.get('desc');
                modsList.push(moduleCode);
            })
            
            setStr("hello");
            // if (modsList.length === 0) {
            //     console.log("modsList Length is " + modsList.length);
            //     setStr("Empty");
            // } else {
            //     setStr(modsList.toString());
            // }
        }
        getModules();
    })

    const acceptHandler = async () => {
        await setDoc(doc(db, 'Users/'+ auth.currentUser.uid + '/Friends/' + idField), {
            id: idField,
        })
        await setDoc(doc(db, 'Users/'+ idField + '/Friends/' + auth.currentUser.uid), {
            id: auth.currentUser.uid,
        })
        await deleteDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid))
        await deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + idField))
        setVisible(false)
        setStatus('success');
        console.log("accepted and turned invisible!");
    }

    const declineHandler = async () => {
        await (deleteDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid)));
        await (deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + idField)));
        setVisible(false)
        console.log("declined and turned invisible");
    }

    const navigation = useNavigation();
    
    return (
        <Button onPress={() => setVisible(true)} status={status} appearance='outline' style={styles.rect}>
            <Text status='primary'>User: {idField}</Text>
            <Modal visible={visible}>
                <Card disabled={true}>
                    <Text style={[styles.modalText]}>These are the modules they are taking:</Text>
                    <Layout level='2'>
                        <Text style={[styles.modalText]}>{finalStr}</Text>
                        <Button 
                        onPress = {() => {navigation.navigate('User Profile', {userID: idField}),
                        setVisible(false)}}>
                            <Text>View Profile</Text>
                        </Button>
                        <Button
                        onPress={acceptHandler}>
                            <Text>Accept</Text>
                        </Button>
                        <Button
                        onPress={declineHandler}>
                            <Text>Decline</Text>
                        </Button>
                    </Layout>
                    <Button onPress={() => setVisible(false)}>
                        Dismiss
                    </Button>
                </Card>
            </Modal>
        </Button>
    );
};

export default UserResult;

const styles = StyleSheet.create({
    rect: {
        padding: 2,
        marginVertical: 8,
        marginHorizontal: 16,
      },
    container: {
        minHeight: 192,
      },
    modalText: {
        textAlign: 'center'
    }
})