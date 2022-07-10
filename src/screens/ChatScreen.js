import React from 'react'
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    useTheme,
    Icon,
    Button,
    Text,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet} from "react-native";
import { LogoutButton, AwaitButton } from '../components';
import { useFocusEffect, useNavigation, NavigationContainer } from '@react-navigation/native';
import { auth, db } from '../firebase';
import {
    collection,
    getDocs,
    addDoc,
    setDoc,
    getDoc,
    doc,
    deleteDoc
} from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { setRefreshTrue, setRefreshFalse } from '../store/refresh';
import { useEffect } from 'react';

const ChatScreen = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const refresh = useSelector(state => state.refresh.refresh);
    const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};
    const reduxRefreshFalse = () => {dispatch(setRefreshFalse());};

    const testFn = async () => {
        const namez = (await getDoc(doc(db, "Users/"+auth.currentUser.uid))).get("displayName");
        console.log(namez);
    }

    useEffect(() => {
        reduxRefreshFalse();
    }, [refresh]);

    const navigation = useNavigation();

    const titleText = props => {
        return (<Text {...props} style={{}} category='h5'>Chat</Text>);
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView style={{flex:1, backgroundColor: theme['background-basic-color-4']}}>
                <TopNavigation 
                    title={titleText}
                    alignment='start'
                    accessoryLeft={<Icon name='frienus' pack='customAssets' style={{marginLeft:5, height:60, width:60}} />}
                    accessoryRight={LogoutButton}
                    style={{height:'8%', backgroundColor: theme['background-basic-color-1']}}
                />
                <Layout level='3' style={{flex:1, justifyContent:'center'}}>
                    {/* <Text style={{textAlign:'center', textAlignVertical:'center',}}>Work In Progress for Milestone 3</Text>
                    <Text>{`${refresh}`}</Text>
                    <Button onPress={reduxRefreshTrue}>TRUE BUTTON</Button>
                    <Button onPress={reduxRefreshFalse}>FALSE BUTTON</Button>
                    <AwaitButton awaitFunction={testFn} title={"Hello"}></AwaitButton> */}
                </Layout>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    rect: {
        padding: 2,
        marginVertical: 8,
        marginHorizontal: 16,
      },
    modalText: {
        textAlign: 'center'
    }
})