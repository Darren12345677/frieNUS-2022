import React from 'react';
import { 
    Button,
    Text,
    Layout,
    Card,
    Icon, 
} from '@ui-kitten/components';
import { StyleSheet } from "react-native";
import {  useNavigation } from '@react-navigation/native';

const ProfileEntry = ({item}) => {
    const navigation = useNavigation();

    return (
    <Card onPress = {() => navigation.navigate('User Profile', {userID: item.id})} style={styles.card}>
    <Layout level='1' style={styles.container}>
    <Icon name='person' fill='cornflowerblue' style={[styles.icon, styles.profileIcon]}/>
    <Layout style={styles.textContainer}>
        <Text category='s1' style={styles.displayText}>User ID:</Text>
        <Text category='c1' style={styles.displayText}>"{item.id}"</Text>
    </Layout>
    <Icon name='navigation-2' style={styles.navIcon} fill='orange'/>
    {/* <Button 
    status='basic'
    onPress = {() => navigation.navigate('User Profile', 
    {userID: item.id})}
    appearance='outline'>
    </Button> */}
    </Layout>
    </Card>

    )
}

export default ProfileEntry;

const styles = StyleSheet.create({
    card: {
        marginHorizontal:25,
    },
    container: {
        flexDirection:'row',
        alignItems:'center',
    },
    displayText: {
        marginLeft:10,
    },
    navIcon: {
        width:20,
        height:20,
    },
    profileIcon: {
        width:30,
        height:30,
        marginLeft:-15,
        
    },
    textContainer: {
        flexDirection:'column',
        width:'90%',
    },
})