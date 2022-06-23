import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button, Card, Layout, Modal, Divider } from '@ui-kitten/components';
import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    getDoc,
    doc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { ConnectButton } from '../../components';
import { useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const UserResult = ({userFields}) => {
    const idField = userFields.id;
    const [visible, setVisible] = React.useState(false);
    const [finalStr, setStr] = React.useState("");

    useFocusEffect(() => {
        const colRef = collection(db, 'Users/' + idField + '/Modules');
        const getModules = async () => {
            const modsList = [];
            await (await getDocs(colRef)).forEach((doc) => {
                const moduleCode = doc.get('desc');
                modsList.push(moduleCode);
            })
            
            if (modsList.length === 0) {
                console.log("modsList Length is " + modsList.length);
                setStr("Empty");
            } else {
                setStr(modsList.toString());
            }
        }
        getModules();
    })

    const navigation = useNavigation();
    
    return (
        <Button onPress={() => navigation.navigate('Module List', {currUser: idField})} status='primary' appearance='outline' style={styles.rect}>
            <Text status='primary'>User: {idField}</Text>
            <Modal visible={visible}>
                <Card disabled={true}>
                    <Text style={[styles.modalText]}>These are the modules they are taking:</Text>
                    <Layout level='2'>
                        <Text style={[styles.modalText]}>{finalStr}</Text>
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