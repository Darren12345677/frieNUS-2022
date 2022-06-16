import {
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
    addDoc,
    onSnapshot,
    query,
    collection,
    doc,
    deleteDoc,
} from 'firebase/firestore';

import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { Module } from '../components';
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Button,
    Input,
} from '@ui-kitten/components';


const INPUT_PLACEHOLDER = 'Add your module codes here';

const HomeScreen = () => {
    const [module, setModule] = useState('');
    const [moduleList, setModuleList] = useState([]);
    const currUser = auth.currentUser.uid;

    useEffect(() => {
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        const moduleQuery = query(collection(db, currUser));
        
        const unsubscribe = onSnapshot(moduleQuery, (snapshot) => {
            const modules = [];

            snapshot.forEach((doc) => {
                modules.push({ id: doc.id, ...doc.data() });
            });

            setModuleList([...modules]);
        });

        return unsubscribe;
    }, [onSubmitHandler]);

    const showRes = (text) => {
        console.log(text);
        Alert.alert(
            text,"",[{text:"Dismiss", onPress: () => console.log("Dismissed")}]
        )
    };

    // https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9
    // https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_7
    const onSubmitHandler = async () => {
        if (module.length === 0) {
            showRes('Module description cannot be empty!');
            return;
        }

        try {
            const moduleRef = await addDoc(collection(db, currUser), {
                desc: module,
                completed: false,
            });

            console.log('onSubmitHandler success', moduleRef.id);
            showRes('Successfully added module!');
            clearForm();
        } catch (err) {
            console.log('onSubmitHandler failure', err);
            showRes('Failed to add module!');
        }
    };

    const onDeleteHandler = async (id) => {
        try {
            await deleteDoc(doc(db, currUser, id));
            console.log('onDeleteHandler success', id);
            showRes('Successfully deleted module!');
        } catch (err) {
            console.log('onDeleteHandler failure', err);
            showRes('Failed to delete module!');
        }
    };

    const clearForm = () => {
        setModule('');
        Keyboard.dismiss();
    };

    const successfulLogoutAlert = () => {
        console.log("Successful Logout")
        Alert.alert(
            "Logged out!",
            //This empty argument is for the captions. Otherwise app will crash when msg is displayed.
            "",
            [{ text:"Dismiss", onPress: () => console.log("Dismissed")} ]
        )
    };

    const logoutHandler = () => {
        signOut(auth).then(() => {
            //This alert must be done before the hook or else it will not display
            successfulLogoutAlert();
            setIsAuth(false);
        });
    };

    const LogoutIcon = () => (
        <TouchableOpacity onPress={logoutHandler}>
            <MaterialIcons name="logout" size={28} color="#6696ff" />
        </TouchableOpacity>
    );

    const addIcon = (props) => {
        return (
        <Icon name='plus-circle' pack='eva' {...props}/>
        );
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? null : null}
            >
                <TopNavigation 
                    title='Profile'
                    alignment='start'
                    accessoryRight={LogoutIcon}
                    accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, width:60, height:60}} />}
                    style={{height:'8%'}}
                    />
                <Divider/>
                <Layout level='1' style={[styles.content]}>
                    <Layout level='2' style={styles.inputContainer}>
                        <Input
                            onChangeText={setModule}
                            value={module}
                            placeholder={INPUT_PLACEHOLDER}
                            style={styles.moduleInput}
                            status='basic'
                        /> 
                        <Button
                            onPress={onSubmitHandler}
                            style={styles.button}
                            accessoryLeft={addIcon}
                            size='giant'
                            status='primary'
                            appearance='ghost'
                        >
                        </Button>
                    </Layout>
                    <Layout style={styles.listContainer}>
                        <List
                            data={moduleList}
                            renderItem={({ item, index }) => (
                                <Module
                                    data={item}
                                    key={index}
                                    onDelete={onDeleteHandler}
                                />
                            )}
                            style={styles.list}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={Divider}
                        />
                    </Layout>
                </Layout>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    content: {
        flex: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        //backgroundColor: 'red',
    },
    listContainer: {
        // backgroundColor:'red',
        flex: 10,
        width: '100%',
    },
    list: {
        overflow: 'scroll',
    },
    inputContainer: {
        // backgroundColor:'black',
        flex: 1,
        width:'100%',
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    moduleInput: {
        flex: 10,
        marginLeft: 16,
    },
    button: {
        flex: 0.25,
        marginHorizontal: 10,
    },
});
