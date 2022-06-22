import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
} from '@ui-kitten/components';
import {
    onSnapshot,
    query,
    collection,
} from 'firebase/firestore';
import { db } from '../firebase';
import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, SafeAreaView, StyleSheet,} from "react-native";
import { SearchBar } from "react-native-elements";
import { UserResult, DATA, LogoutButton } from '../components';


const SearchScreen = () => {

	const [data, setData] = useState([]);
	const [searchValue, setSearchValue] = useState("");
    const [arrayHolder, setArrayHolder] = useState([])

    useEffect(() => {
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        const userQuery = query(collection(db, 'Users'));
        
        const TT = onSnapshot(userQuery, (snapshot) => {
            const userList = []
            snapshot.forEach((doc) => {
                userList.push({ id: doc.id, ...doc.data() });
            });
            setArrayHolder([...userList]);
            setData([...userList]);
        });

        return TT;
    }, [setSearchValue]);

	const searchFunction = (text) => {
		const updatedData = arrayHolder.filter((item) => {
		  const item_data = `${item.id.toUpperCase()})`;
		  const text_data = text.toUpperCase();
		  return item_data.indexOf(text_data) > -1;
		});
        //console.log("Search Function called");
		setData(updatedData);
        //console.log(updatedData);
		setSearchValue(text);
	  };
      
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
                <Divider/>
                <Layout style={styles.content}>
                    <Layout style={styles.searchContainer}>
                        <SearchBar
                        placeholder="Search for users..."
                        lightTheme
                        round
                        value={searchValue}
                        onChangeText={(text) => searchFunction(text)}
                        autoCorrect={false}
                        />
                    </Layout>
                    <Layout style={styles.listContainer}>
                        <List
                        data={data}
                        renderItem={({ item }) => {
                                return (<UserResult userFields={item} />)
                            }}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={Divider}
                        />
                    </Layout>
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
        backgroundColor: 'red',
	},
	item: {
	  padding: 2,
	  marginVertical: 8,
	  marginHorizontal: 16,
	},
    searchContainer: {
        width:'100%',
    },
    listContainer: {
        backgroundColor:'red',
        flex: 1,
        width:'100%',
    }
  });