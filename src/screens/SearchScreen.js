import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
} from '@ui-kitten/components';
import React, { useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, StyleSheet,} from "react-native";
import { SearchBar } from "react-native-elements";
import { UserResult, DATA } from '../components';


const SearchScreen = (datas) => {

    // db.listCollections().then(collections => {
    //     for (let collection of collections) {
    //         console.log('Found collection with id: ${collection.id}');
    //     }
    // });
    

	const [data, setData] = useState(DATA);
	const [searchValue, setSearchValue] = useState("");
	const arrayHolder = DATA;

	const searchFunction = (text) => {
		const updatedData = arrayHolder.filter((item) => {
		  const item_data = `${item.title.toUpperCase()})`;
		  const text_data = text.toUpperCase();
		  return item_data.indexOf(text_data) > -1;
		});
		setData(updatedData);
		setSearchValue(text);
	  };

	return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView style={{flex:1}}>
                <TopNavigation 
                    title='Search'
                    alignment='start'
                    accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
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
                        renderItem={({ item }) => (
                            <UserResult title={item.title} />
                        )}
                        // renderItem={renderUserResult}
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