import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Button,
    Text,
    useTheme,
    Input,
    Autocomplete,
    AutocompleteItem
} from '@ui-kitten/components';
import {
    onSnapshot,
    query,
    collection,
    getDocs,
    collectionGroup,
    where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import React, { useState, useEffect } from "react";
import { Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, } from "react-native";

import { LogoutButton, AwaitButton } from '../components';
import {  useNavigation, useIsFocused } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';

const SearchScreen = () => {
    const [usersArr, setUsersArr] = useState([]);
	const [autoArr, setAutoArr] = useState([]);
    const [currArr, setCurrArr] = useState([]);
	const [value, setValue] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};
    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};
    const theme = useTheme();
    const isFocus = useIsFocused();

    useEffect(() => {
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        const users = getDocs(collection(db, 'Users'));
        users.then(res => {
            const userList = [];
            res.forEach(doc => {
                const modulesRef = collection(db, 'Users/' + doc.id + '/Modules');
                const modules = query(modulesRef, where('modCode', 'in', ['CS1010', 'CS1010R', 'ACC1002']));
                const querySnapshot = getDocs(modules);
                querySnapshot.then(res => {
                    res.forEach(module => {
                        console.log(module.id);
                        console.log(doc.id);
                    })
                })

                userList.push({ id: doc.id, ...doc.data()});
            })
            setUsersArr([...userList]);
            setAutoArr([...userList]);
            setCurrArr([...userList]);
        })

        // const modules = query(collectionGroup(db, 'Modules'), where('modCode', '==', 'CS1010'));
        // const querySnapshot = getDocs(modules);
        // querySnapshot.then(res => {
        //     res.forEach(doc => {
        //         console.log(doc.id);
        //     });
        // });

        // const userQuery = query(collection(db, 'Users'));
        // const TT = onSnapshot(userQuery, (snapshot) => {
        //     console.log("Listening");
        //     const userList = []
        //     snapshot.forEach((doc) => {
        //         userList.push({ id: doc.id, ...doc.data() });
        //     });
        //     setArrayHolder([...userList]);
        //     setData([...userList]);
        // });
        reduxRefreshFalse();
        // return TT;
    }, [isFocus]);

	// const searchFunction = (text) => {
	// 	const updatedData = arrayHolder.filter((item) => {
	// 	  const item_data = `${item.id.toUpperCase()})`;
	// 	  const text_data = text.toUpperCase();
	// 	  return item_data.indexOf(text_data) > -1;
	// 	});
	// 	setData(updatedData);
	// 	setSearchValue(text);
	//   };
      
    const navigation = useNavigation();

    const filter = (item, query) => item.id.toLowerCase().includes(query.toLowerCase());
  
    const onSelect = (index) => {
        setValue(usersArr[index].id);
        setCurrArr(usersArr.filter(item => filter(item, usersArr[index].id)));
        Keyboard.dismiss();
    };
  
    const onChangeText = (query) => {
      setValue(query);
      setAutoArr(usersArr.filter(item => filter(item, query)));
    };
  
    const renderOption = (item, index) => (
      <AutocompleteItem
        key={index}
        title={item.id}
      />
    );

	return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView style={{flex:1}}>
                <TopNavigation 
                    title='Search'
                    alignment='start'
                    accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                    accessoryRight={LogoutButton}
                    style={{height:'8%'}}
                />
                <Layout level='1' style={{flex: 1, alignItems:'center', justifyContent:'flex-start', flexDirection:"column"}}>
                    <Layout level='1' style={{paddingTop:10, width:'95%'}}>
                        <Autocomplete
                            status={value.length==0 ? 'basic' : 'primary'}
                            placeholder='Tap here to search for users'
                            value={value}
                            onSelect={onSelect}
                            onChangeText={onChangeText}
                            accessoryLeft={<Icon name='search-outline'/>}
                            accessoryRight={value.length != 0 ? <Icon name='close-outline' onPress={() => {
                                setValue("");
                                setCurrArr(usersArr);
                                Keyboard.dismiss();
                                }}/> : null}
                            onBlur={() => {
                                setCurrArr(usersArr.filter(item => filter(item, value)));
                                setIsSearch(false)}}
                            placement='bottom'
                            onPressIn={() => {setIsSearch(true);}}
                            style={[styles.AC]}
                            >
                            {autoArr.map(renderOption)}
                        </Autocomplete>
                    </Layout>
                    {isSearch ?
                    <Layout level='1' style={{flex:1}}/>
                    :
                    <Layout level='4' style={styles.listContainer}>
                        <Text appearance='hint' category='h6' style={[styles.listHeader]}>User Profiles</Text>
                        <Divider/>
                        <List
                        style={{flex:1, paddingTop:20}}
                        data={currArr}
                        renderItem={({ item }) => {
                            return (
                                <Button 
                                style = {{marginBottom:10, marginHorizontal:25, justifyContent:'flex-start'}}
                                onPress = {() => navigation.navigate('User Profile', 
                                {userID: item.id})}
                                appearance='outline'>
                                <Text style={{textAlign:'left'}}>User ID: {item.id}</Text>
                                </Button>
                            )
                        }}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={Divider}
                        />
                    </Layout>
                    }
                </Layout>
            </KeyboardAvoidingView>
        </SafeAreaView>
	);
}

export default SearchScreen;

const styles = StyleSheet.create({
	content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
	},
	item: {
	  padding: 2,
	  marginVertical: 8,
	  marginHorizontal: 16,
	},
    listContainer: {
        marginTop: 20,
        paddingTop: 20,
        flex: 1,
        width:'100%',
    },
    searchBar: {
        marginHorizontal: 10,
    },
    listHeader: {
        marginLeft: 20,
        marginBottom: 15,
    },
    AC: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    }
  });


                          {/* <SearchBar
                        placeholder="Search for users..."
                        containerStyle={{backgroundColor: theme['background-basic-color-2']}}
                        inputContainerStyle={{backgroundColor: theme['color-primary-transparent-400']}}
                        style={{
                            backgroundColor: theme['color-primary-400']}}
                        lightTheme
                        round
                        value={searchValue}
                        onChangeText={(text) => searchFunction(text)}
                        autoCorrect={false}
                        /> */}