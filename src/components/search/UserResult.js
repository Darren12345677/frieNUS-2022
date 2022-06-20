import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button, Card, Layout, Modal, Divider } from '@ui-kitten/components';
import {
    collection,
    getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect } from 'react';

const UserResult = ({title, data}) => {
    const currUser = title;
    const [visible, setVisible] = React.useState(false);
    const [finalStr, setStr] = React.useState("");

    useEffect(() => {
        const colRef = collection(db, 'Users/' + currUser + '/Modules');
        const getModules = async () => {
            const modsList = [];
            await (await getDocs(colRef)).forEach((doc) => {
                const moduleCode = doc.get('desc');
                modsList.push(moduleCode);
            })
            setStr(modsList.toString());

            // Oddity
            // if (modsList.length === 0) {
            //     console.log("modsList Length is " + modsList.length);
            //     setStr("Empty"); //Don't undo this as the whole app will lag
            // }
        }
        getModules();
    })
    

    return (
        <Button onPress={() => setVisible(true)} status='primary' appearance='outline' style={styles.rect}>
            <Text status='primary'>User: {title}</Text>
            <Modal visible={visible}>
                <Card disabled={true}>
                    <Text style={[styles.modalText]}>These are the modules they are taking:</Text>
                    <Layout level='2'>
                        <Text style={[styles.modalText]}>{finalStr}</Text>
                    </Layout>
                    <Divider/>
                    <Button>Connect</Button>
                    <Divider/>
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