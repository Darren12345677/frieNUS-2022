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
    orderBy,
    updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Module, LogoutButton, ImprovedAlert, AwaitButton } from '../components';
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Text,
    Autocomplete,
    AutocompleteItem,
    Select,
    SelectItem,
    IndexPath,
    Button,
} from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../store/loading';
import { setRefreshTrue, } from '../store/refresh';
import { setMyModules } from '../store/myModules';

import nusmods from '../assets/nus_mods.json';

const INPUT_PLACEHOLDER = 'Add your module codes here';

const ModuleScreen = () => {
    const [module, setModule] = useState('');
    const [moduleList, setModuleList] = useState([]);
    const [autoArr, setAutoArr] = useState([]);
    const currUser = auth.currentUser.uid;
    const dispatch = useDispatch();
    const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
    const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};
    const myModules = useSelector(state => state.myModules.myModules);
    const reduxSetMyModules = (arr) => {dispatch(setMyModules({input:arr}))};
    const isDisabled = myModules.length >= 10;
    useEffect(() => {
        const moduleQuery = query(collection(db, 'Users/' + currUser + '/Modules'), orderBy("rank"));
        const unsubscribe = onSnapshot(moduleQuery, (snapshot) => {
            const modules = [];     
            snapshot.forEach((doc) => {
                modules.push({ id: doc.id, ...doc.data() });
            });
            setModuleList([...modules]);
            reduxSetMyModules([...modules]);
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
                semesters: semesterStr,
                rank: 1,
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

    const data = [1,2,3,4,5,6,7,8,9,10];

    const ModuleEntry = (props) => {
        const {item, index} = {...props};
        const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));
        const modRef = doc(db, 'Users/' + currUser + '/Modules/' + item.id);
        const renderOption = (title) => (
            <SelectItem title={title}/>
        )
        const fsValue = item.rank
        return (
        <Layout level='2' {...props} style={styles.moduleEntry}>
            <Layout level='2' style={styles.moduleHeader}>
                <Text category='s1'>Rank:</Text>
                <Select
                    size='small'
                    style={styles.select}
                    placeholder='Default'
                    value={fsValue}
                    selectedIndex={selectedIndex}
                    onSelect={indexP => {
                        const newIndex = data[indexP.row];
                        setSelectedIndex(indexP);
                        reduxLoadingTrue();
                        updateDoc(modRef, {rank: newIndex}).then(() => {
                            reduxLoadingFalse();
                            reduxRefreshTrue();
                        })
                        }}
                    >{data.map(renderOption)}</Select>
            </Layout>
            <Module data={item} key={index} onDelete={onDeleteHandler}/>
        </Layout>
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
                <Layout level='1' style={{flex: 1, flexDirection:"column"}}>
                    <Layout level='1' style={{marginHorizontal:10, flexDirection:'row', justifyContent:'flex-start', 
                    alignItems:'center', marginVertical:10}}>                          
                        <Layout style={{width:'85%', justifyContent:'center'}}>
                            <Autocomplete
                            disabled={isDisabled}
                            placeholder={INPUT_PLACEHOLDER}
                            value={module}
                            onSelect={onSelect}
                            onChangeText={onChangeText}
                            placement='bottom'
                            accessoryLeft={<Icon name='book-open-outline'/>}
                            accessoryRight={module.length != 0 ? <Icon name='close-outline' onPress={() => {
                                console.log('Pressed');
                                setModule("");
                                Keyboard.dismiss();
                            }}/> : null}
                            onBlur={() => setAutoArr(nusmods)}
                            style={[styles.AC]}
                            >{autoArr.map(renderOption)}</Autocomplete>
                        </Layout>
                        <Layout level='1' style={{width:'15%'}}>
                            <AwaitButton 
                            disabled={isDisabled}
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
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <ModuleEntry item={item} index={index}/>
                        )}/>
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
        color:"black",
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
    moduleEntry: {
        flexDirection:'column',
    },
    moduleHeader: {
        flexDirection:'row',
        marginLeft: 20,
        alignItems:'center',
        marginTop: 5,
    },
    select: {
        width: '25%',
        marginLeft: 10,
        marginTop: 5,
    },
});