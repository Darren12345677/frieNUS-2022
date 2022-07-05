import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, Button, Card, Modal, Divider } from '@ui-kitten/components';
import {
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

import { ImprovedAlert, AwaitButton } from '../../components';

const NotificationEntry = ({userFields}) => {
    const idField = userFields;
    const [visible, setVisible] = React.useState(false);

    useFocusEffect(() => {
        const colRef = collection(db, 'Users/' + idField + '/Modules');
        const getModules = async () => {
            const modsList = [];
            await (await getDocs(colRef)).forEach((doc) => {
                const moduleCode = doc.get('desc');
                modsList.push(moduleCode);
            })
        }
        getModules();
    })

    const successfulAcceptAlert = () => {
        ImprovedAlert("Successful Accept", "Added new friend!");
    }


    const successfulDeclineAlert = () => {
        ImprovedAlert("Successful Decline", "Declined connect request");
    }

    const acceptHandler = async () => {
        setVisible(false)
        await setDoc(doc(db, 'Users/'+ auth.currentUser.uid + '/Friends/' + idField), {
            id: idField,
        })
        await setDoc(doc(db, 'Users/'+ idField + '/Friends/' + auth.currentUser.uid), {
            id: auth.currentUser.uid,
        })
        await deleteDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid))
        await deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + idField))
        successfulAcceptAlert();
    }

    const declineHandler = async () => {
        setVisible(false);
        await (deleteDoc(doc(db, "Users/" + idField + "/PendingConnects/" + auth.currentUser.uid)));
        await (deleteDoc(doc(db, 'Users/' + auth.currentUser.uid + '/ConnectNotif/' + idField)));
        successfulDeclineAlert();
    }

    const navigation = useNavigation();

    const optionsHeader = (props) => (
        <View {...props}>
            <Text category='h6'>Options</Text>
        </View>
    );
    
    return (
        <Button onPress={() => setVisible(true)} status='primary' appearance='outline' style={styles.rect}>
            <Text status='primary'>User: {idField}</Text>
            <Modal visible={visible}
            onBackdropPress={() => setVisible(false)}>
                <Card disabled={true} header = {optionsHeader}>
                    <Button 
                    onPress = {() => {navigation.navigate('User Profile', {userID: idField}),
                    setVisible(false)}}>
                        <Text>View Profile</Text>
                    </Button>
                    <Divider></Divider>
                    <AwaitButton awaitFunction={acceptHandler} title={"Accept"}/>
                    <Divider></Divider>
                    <AwaitButton awaitFunction={declineHandler} title={"Decline"}/>
                    <Divider></Divider>
                    <Button onPress={() => setVisible(false)}>
                        Dismiss
                    </Button>
                </Card>
            </Modal>
        </Button>
    );
};

export default NotificationEntry;

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