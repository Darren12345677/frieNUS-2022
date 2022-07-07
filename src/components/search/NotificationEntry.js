import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, Button, Card, Modal, Divider } from '@ui-kitten/components';
import { ImprovedAlert, AwaitButton } from '../../components';

const NotificationEntry = (props) => {
    const {idField, onAccept, onDecline} = props;
    const [visible, setVisible] = React.useState(false);
    const navigation = useNavigation();

    const optionsHeader = (props) => (
        <View {...props}>
            <Text category='h6'>Options</Text>
        </View>
    );
    
    return (
        <Button onPress={() => setVisible(true)} status='primary' appearance='outline' style={styles.rect}>
            <Text status='primary'>User: {idField}</Text>
            <Modal visible={visible}
            onBackdropPress={() => setVisible(false)}>
                <Card disabled={true} header = {optionsHeader}>
                    <Button 
                    onPress = {() => {navigation.navigate('User Profile', {userID: idField}),
                    setVisible(false)}}>
                        <Text>View Profile</Text>
                    </Button>
                    <Divider></Divider>
                    <AwaitButton awaitFunction={()=>{
                        setVisible(false)
                        onAccept(idField)
                    }} title={"Accept"}/>
                    <Divider></Divider>
                    <AwaitButton awaitFunction={()=>{
                        setVisible(false)
                        onDecline(idField)
                    }} title={"Decline"}/>
                    <Divider></Divider>
                    <Button onPress={() => setVisible(false)}>
                        Dismiss
                    </Button>
                </Card>
            </Modal>
        </Button>
    );
};

export default NotificationEntry;

const styles = StyleSheet.create({
    rect: {
        padding: 2,
        marginVertical: 8,
        marginHorizontal: 16,
      },
    container: {
        minHeight: 192,
      },
    modalText: {
        textAlign: 'center'
    }
})