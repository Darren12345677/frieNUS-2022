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
    Autocomplete,
    AutocompleteItem,
    Button,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../store/loading';
import { setRefreshTrue, } from '../store/refresh';
import nusmods from '../assets/nus_mods.json';

const INPUT_PLACEHOLDER = 'Add your module codes here';

const ModuleScreen = () => {
    const [module, setModule] = useState('');
    const [moduleList, setModuleList] = useState([]);
    const [autoArr, setAutoArr] = useState([]);

    const currUser = auth.currentUser.uid;
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
    const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};

    useEffect(() => {
        console.log("Module Screen");
        // fetch('https://api.nusmods.com/v2/2018-2019/moduleList.json')
        // .then(res => res.json())
        // .then(data => {
        //     const modsList = [];
        //     data.forEach(mod => {
        //         modsList.push({modCode: mod.moduleCode})
        //     })
        //     setNUSMods(modsList)})
        // .catch(error => console.log('ERROR'));

        // console.log(nusMods);

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
        } else if (nusmods.filter(item => filter(item, module)).length === 0) {
            showRes('Invalid Module Code!');
            return;
        } 
        try {
            clearForm();
            const data = nusmods.filter(item => item.moduleCode == module)
            let semesterStr = '';
            data[0].semesters.forEach(res => semesterStr += res + ' ');
            console.log(data[0]);
            console.log(semesterStr);
            const moduleRef = await addDoc(collection(db, 'Users/' + currUser + '/Modules'), {
                modCode: module,
                desc: data[0].title,
                semesters: semesterStr
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

    const filter = (item, query) => item.moduleCode.toLowerCase().includes(query.toLowerCase());
  
    const onSelect = (index) => {
        setModule(autoArr[index].moduleCode);
        Keyboard.dismiss();
    };
  
    const onChangeText = (query) => {
      setModule(query);
      setAutoArr(nusmods.filter(item => filter(item, query)));
    };
  
    const renderOption = (item, index) => (
      <AutocompleteItem
        key={index}
        title={item.moduleCode}
      />
    );

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
                <Layout level='1' style={{flex: 1, flexDirection:"column"}}>
                    <Layout level='1' style={{marginHorizontal:10, flexDirection:'row', justifyContent:'flex-start', 
                    alignItems:'center', marginVertical:10}}>
                        <Layout style={{width:'85%', justifyContent:'center'}}>    
                            <Autocomplete
                            placeholder={INPUT_PLACEHOLDER}
                            value={module}
                            onSelect={onSelect}
                            onChangeText={onChangeText}
                            placement='bottom'
                            accessoryLeft={<Icon name='book-open-outline'/>}
                            accessoryRight={module.length != 0 ? <Icon name='close-outline' onPress={() => {
                                console.log('Pressed');
                                setModule("");
                                // setAutoArr(nusmods);
                                Keyboard.dismiss();
                            }}/> : null}
                            onBlur={() => setAutoArr(nusmods)}
                            style={[styles.AC]}
                            >{autoArr.map(renderOption)}</Autocomplete>
                        </Layout>
                        <Layout level='1' style={{width:'15%'}}>
                            <AwaitButton 
                            awaitFunction={onSubmitHandler} 
                            style={styles.button} 
                            accessoryLeft={<Icon name='plus-outline' pack='eva'/>}
                            status='primary'
                            />
                        </Layout>
                    </Layout>
                <Layout level='4' style={{flex:10}}>
                    <Text category='h6' style={{marginLeft:20,marginVertical:15}}>Your Modules</Text>
                    {moduleList.length != 0 
                    ? <List
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
                        /> 
                    : 
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
        flex: 1,
        justifyContent: 'flex-start',
        // alignItems: 'center',
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
        backgroundColor:'black',
        flex: 1,
        paddingVertical: 10,
    },
    AC: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    button: {
        flex: 0.05,
        marginLeft: 10,
        marginRight: 10,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    noModulesText: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});


{/* <Input
    onChangeText={setModule}
    value={module}
    placeholder={INPUT_PLACEHOLDER}
    style={styles.moduleInput}
    status='basic'
/> */}