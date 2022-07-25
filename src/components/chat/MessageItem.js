import React from 'react'
import { auth } from "../../firebase";
import { 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    Icon,
    Button,
    Input,
    Text,
    Card,
    Modal,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View} from "react-native";
const MessageItem = ({item}) => {
    const isCurrentUser = item.sender === auth.currentUser.uid;

    return (
        <View style={isCurrentUser ? styles.containerCurrent : styles.containerOther}>
            <View style={isCurrentUser ? styles.containerTextCurrent : styles.containerTextOther}>
                <Text style={styles.text}>{item.desc}</Text>
            </View>
        </View>
    )
}

export default MessageItem;

const styles = StyleSheet.create({
    containerOther: {
        padding: 20,
        paddingVertical: 3,
        paddingHorizontal: 10,
        flexDirection: 'row',
        flex: 1,
        // backgroundColor: 'red',
    },
    containerTextOther: {
        marginHorizontal: 14,
        backgroundColor: 'grey',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerCurrent: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        flexDirection: 'row-reverse',
        flex: 1,
        // backgroundColor: 'black',
    },
    containerTextCurrent: {
        marginHorizontal: 14,
        backgroundColor: 'steelblue',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: 'white'
    },
    displayName: {
        color: 'gray',
        fontSize: 13
    }, 
    modCodeText: {
        fontWeight: 'bold',
        flex: 1,
        flexDirection: 'row',
        fontFamily: 'Arial',
        textAlign:'left',
        fontSize:12, 
    },
})