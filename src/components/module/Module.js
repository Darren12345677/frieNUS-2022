import { StyleSheet, Platform } from 'react-native';
import React from 'react';
import { Text, Layout, Button, Icon } from '@ui-kitten/components';


const Module = (props) => {
    const { data, onDelete } = props;

    const renderTrashIcon = (props) => {
        return <Icon {...props} name='trash-2' pack='eva'/>
    }

    const DeleteIcon = (props) => (
        <Button 
          onPress={() => onDelete(data.id)} 
          accessoryLeft={renderTrashIcon} 
          size='medium'
          appearance='ghost'
          status='basic'
          style={{paddingTop:0, paddingBottom:10, paddingRight:5}}>
        </Button>
    );

    return (
        <Layout style={[styles.container, styles.containerShadow]}>
            <Layout style = {[styles.header]} />
            <Layout level='2' style = {[styles.contents]}>
                <Text style={[styles.taskText, {lineHeight: Platform.OS === 'ios' ? 30 : 20}]}>
                    {data.desc}
                </Text>
                <DeleteIcon />
            </Layout>
        </Layout>
    );
};

export default Module;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'aliceblue',
        flexDirection: 'column',
        marginHorizontal: 14,
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 4,
    },
    header: {
        flex: 1,
        backgroundColor: "darkorange",
        width: "100%",
        height: 3,
    },
    contents: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 6,
        paddingTop: 5,
    },
    containerShadow: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    taskText: {
        fontWeight: 'bold',
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        fontFamily: 'Arial',
    },
});
