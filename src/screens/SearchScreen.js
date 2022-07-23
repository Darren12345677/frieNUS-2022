import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Text,
    useTheme,
    Autocomplete,
    AutocompleteItem,
    Popover,
} from '@ui-kitten/components';
import {
    query,
    collection,
    getDocs,
    where,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import React, { useState, useEffect } from "react";
import { Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, } from "react-native";

import { LogoutButton, AwaitButton, ImprovedAlert, ProfileEntry } from '../components';
import { useIsFocused } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux';
import { setRefreshFalse } from '../store/refresh';

const SearchScreen = () => {
    //Users arr is the array of all users
    const [usersArr, setUsersArr] = useState([]);
    //Auto array is the array of autocomplete options that show up
	const [autoArr, setAutoArr] = useState([]);
    //Current array is the array that is being rendered under User Profiles
    const [currArr, setCurrArr] = useState([]);
    //Reccomendation array is the array that is being rendered under Recommendations
    const [recoArr, setRecoArr] = useState([]);

    const theme = useTheme();
	const [value, setValue] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const myModules = useSelector(state => state.myModules.myModules);
    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};
    const isFocus = useIsFocused();

    const pointSys = 
        [2, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1];
    const myModuleRanks = [...myModules.map(obj => {
        const mappedObj = {modCode: obj.modCode, point: pointSys[obj.rank-1]}
        return mappedObj;
    })];
    const arrOfModCodes = myModuleRanks.map(res => res.modCode);

    const currUser = auth.currentUser.uid;

    useEffect(() => {
        const users = getDocs(collection(db, 'Users'));
        users.then(snapshot => {
            const userList = [];
            snapshot.forEach(userDoc => {
                userList.push({ id: userDoc.id, ...userDoc.data()});
            })
            setUsersArr([...userList]);
            setAutoArr([...userList]);
            setCurrArr([...userList]);
        })
        reduxRefreshFalse();
    }, [isFocus, refresh]);


    const filter = (item, query) => item.id.toLowerCase().includes(query.toLowerCase());
  
    const onSelect = (index) => {
        setValue(usersArr[index].id);
        setCurrArr(usersArr.filter(item => filter(item, usersArr[index].id)));
        Keyboard.dismiss();
        // setIsSearch(false)
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

    const DisplayRest = () => (
        <>
        <Layout level='1' style={styles.searchContainer}>
            <Layout level='4' style={styles.ribbon}>
                <Text appearance='hint' category='h6' style={styles.ribbonText}>User Profiles</Text>
            </Layout>            
            <Divider/>
            <List style={styles.list} data={currArr}
            renderItem={({item}) => (<ProfileEntry item={item}/>)}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={Divider}/>
        </Layout>
        <Layout level='1' style={styles.recommendContainer}>
        <Layout level='4' style={[styles.ribbon, styles.recommendRibbon]}>
            <Text appearance='hint' category='s1' style={styles.ribbonText}>Suggestions</Text>
            <Popover visible={visible} anchor={renderHelpIcon} onBackdropPress={() => setVisible(false)}>
                <Layout style={styles.helpPopup}>
                    <Text style={styles.helpText}>
                    Suggestions are displayed in descending order based on module similarity and ranking.
                    </Text>
                </Layout>
            </Popover>
            <AwaitButton style={styles.recommendButton} awaitFunction={recommendHandler}>Recommend</AwaitButton>
        </Layout>
        {recoArr.length == 0 ? <DisplayNoRecoList/> : <DisplayRecoList/>}
        </Layout>
        </>
    )

    const generateRecommendations = async () => {
        const users = await getDocs(collection(db, 'Users'));
        const userList = [];
        let numUsersResolved = 0;
        users.forEach(user => {
            if (user.id !== currUser) {
            const modulesRef = collection(db, 'Users/' + user.id + '/Modules');
            //Obtain a snapshot of matching modules this user has with us
            const modulesQuery = query(modulesRef, where('modCode', 'in', myModuleRanks.map(obj => obj.modCode)));
            getDocs(modulesQuery).then(qSnapshot => {
                let curr = 0;
                const numOfMatches = qSnapshot.size;
                console.log("numOfMatches is: " + numOfMatches);
                let totalPoints = 0;
                qSnapshot.forEach(module => {
                    const code = module.get('modCode');
                    console.log("Matched " + code);
                    //Here we try to find the index and match it to the point
                    const ind = arrOfModCodes.findIndex(elem => elem == code);
                    const newPoint = myModuleRanks[ind].point;
                    curr += 1
                    totalPoints += newPoint;
                    if (curr == numOfMatches) {
                        // numUsersResolved += 1;
                        userList.push({id: user.id, points:totalPoints});
                        console.log(userList);
                        console.log("numUsersResolved is: " + numUsersResolved)
                        console.log("numUsersResolved is: " + numUsersResolved)
                        if (numUsersResolved >= users.size-1) {
                            //sort based on descending order
                            const sortedArr = userList.sort(function(userA, userB){return userB.points-userA.points});
                            const slicedArr = sortedArr.slice(0,5);
                            setRecoArr([...slicedArr]);
                            console.log("sorted");
                        }
                    }})})
                numUsersResolved += 1;
            }
    })
    }

    const recommendHandler = async () => {
        if (myModuleRanks.length == 0) {
            ImprovedAlert("Not enough modules to recommend users", "Add some modules into your profile first");
            setRecoArr([]);
        } else {
            await generateRecommendations();
        }
    }

    const DisplayRecoList = () => (
        <List style={styles.list} data={recoArr}
        renderItem={({item}) => (<ProfileEntry item={item}/>)}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Divider}/>
    );

    const DisplayNoRecoList = () => (
        <Layout style={styles.noReco} level='1'>
            <Text category='s2' status='danger'>Uh oh... We are unable to find other similar users</Text>
            <Text category='s2' status='danger'>Try adding other modules</Text>
        </Layout>
    );

    const displayHelp = () => {
        setVisible(true);
    }

    const renderHelpIcon = () => (
        <Icon onPress={displayHelp} name='question-mark-circle' fill={theme['color-basic-600']} style={styles.helpIcon}/>
    );

    const Searchbar = () => (
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
            console.log("blur");
            setCurrArr(usersArr.filter(item => filter(item, value)));
            setIsSearch(false)}}
        placement='bottom'
        // onPressIn={() => {setIsSearch(true);}}
        style={[styles.AC]}
        >
        {autoArr.map(renderOption)}
    </Autocomplete>
    )

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
                        <Searchbar/>
                    </Layout> 
                    {isSearch 
                    ? <Layout level='1' style={{flex:1}}/> : <DisplayRest/>
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
    searchContainer: {
        paddingTop: 10,
        flex: 1,
        width:'100%',
    },
    recommendContainer: {
        // marginTop: 20,
        paddingTop: 0,
        flex: 1,
        width:'100%',
    },
    recommendSettings: {
        flexDirection:'row',
        justifyContent:'space-around',
    },
    recommendRibbon: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    recommendText: {
        paddingVertical: 5,
        marginLeft: 20,
        flex:3,
    },
    list: {
        flex:1, 
        paddingTop:5,
    },
    searchBar: {
        marginHorizontal: 10,
    },
    ribbon: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        marginBottom:5,
    },
    AC: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    recommendButton: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        marginLeft: 25,
        marginRight: 10,
    },
    noReco: {
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    pointsText: {
        marginLeft:10,
    },
    helpIcon: {
        width:25,
        height:25,
        marginLeft:-30,
    },
    helpPopup: {
        margin:5,
        width:'75%',
    },
    helpText: {
        textAlign:'left',
        marginLeft:5,
    },
  });