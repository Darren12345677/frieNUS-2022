import {
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Keyboard,
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

import { auth, db } from '../firebase';
import { Module, LogoutButton, ImprovedAlert, AwaitButton } from '../components';
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Input,
    Text,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../store/loading';
import { setRefreshTrue, } from '../store/refresh';

const INPUT_PLACEHOLDER = 'Add your module codes here';

const ModuleScreen = () => {
    const [module, setModule] = useState('');
    const [moduleList, setModuleList] = useState([]);
    const currUser = auth.currentUser.uid;
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
    const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};

    useEffect(() => {
        console.log("Module Screen");
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        const moduleQuery = query(collection(db, 'Users/' + currUser + '/Modules'));
        const unsubscribe = onSnapshot(moduleQuery, (snapshot) => {
            const modules = [];     
            snapshot.forEach((doc) => {
                modules.push({ id: doc.id, ...doc.data() });
            });
            setModuleList([...modules]);
        });
        return unsubscribe;
    }, []);

    const showRes = (text) => {
        ImprovedAlert(text, text);
    }

    const onSubmitHandler = async () => {
        if (module.length === 0) {
            showRes('Module description cannot be empty!');
            return;
        }
        try {
            clearForm();
            const moduleRef = await addDoc(collection(db, 'Users/' + currUser + '/Modules'), {
                desc: module,
            });
            showRes('Successfully added module!');
        } catch (err) {
            showRes('Failed to add module!');
        }
    };

    const onDeleteHandler = async (id) => {
        try {
            reduxLoadingTrue();
            await deleteDoc(doc(db, 'Users/' + currUser + '/Modules', id));
            reduxRefreshTrue();
            reduxLoadingFalse();
            showRes('Successfully deleted module!');
        } catch (err) {
            reduxRefreshTrue();
            reduxLoadingFalse();
            showRes('Failed to delete module!');
        }
    };

    const clearForm = () => {
        setModule('');
        Keyboard.dismiss();
    };

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
                    title='Modules'
                    alignment='start'
                    accessoryRight={LogoutButton}
                    accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, width:60, height:60}} />}
                    style={{height:'8%'}}
                    />
                <Divider/>
                <Layout level='1' style={[styles.content]}>
                    <Layout level='3' style={styles.inputContainer}>
                        <Input
                            onChangeText={setModule}
                            value={module}
                            placeholder={INPUT_PLACEHOLDER}
                            style={styles.moduleInput}
                            status='basic'
                        />
                        <AwaitButton 
                        awaitFunction={onSubmitHandler} 
                        style={styles.button} 
                        accessoryLeft={addIcon}
                        size='giant'
                        status='primary'
                        appearance='ghost'/>
                    </Layout>
                <Divider/>
                    <Layout level='1' style={styles.listContainer}>
                        {moduleList.length != 0 ? <List
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
                        /> : 
                        <Layout level='1' style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                        <Text category='p1' status='info' style={[styles.noModulesText]}> You have not added any modules yet</Text>
                        </Layout>}
                    </Layout>
                </Layout>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ModuleScreen;

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
        // flex: 1,
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
        flex: 0.05,
        marginRight: 5,
        // borderColor:'black',
    },
    noModulesText: {
        textAlign: 'center',
        textAlignVertical: 'center',
    }
});
