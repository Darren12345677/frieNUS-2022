import { StyleSheet, Platform } from 'react-native';
import React from 'react';
import { Text, Layout, Icon, Card } from '@ui-kitten/components';
import { AwaitButton } from "../../components";

const Module = (props) => {
    const { data, onDelete } = props;

    const renderTrashIcon = (props) => {
        return <Icon {...props} name='trash-2' pack='eva'/>
    }

    const DeleteIcon = (props) => (
        <AwaitButton 
        awaitFunction={() => onDelete(data.id)}
        accessoryRight={renderTrashIcon} 
        size='medium'
        appearance='ghost'
        status='basic'
        style={{paddingTop:0, paddingBottom:10, paddingRight:5}}/>
    );

    const headerText = (props) => {
        return (
        <>
        <Text {...props} category='s1' style={[styles.modCodeText, {lineHeight: Platform.OS === 'ios' ? 30 : 20}]}>
        {data.modCode}
        </Text>
        <Text status='primary' category='label' style={[styles.modSemText, {lineHeight: Platform.OS === 'ios' ? 15 : 10}]}>
        Sem: {data.semesters}
        </Text>
        </>
        );
    }

    const semText = (props) => {
        return (
        <Text status='primary' category='label' style={[styles.modSemText, {lineHeight: Platform.OS === 'ios' ? 15 : 10}]}>
        Sem: {data.semesters}
        </Text>);
    }

    return (
        <Layout style={[styles.container, styles.containerShadow]}>
            <Layout style = {[styles.header]} />
            <Layout level='1' style = {[styles.contents]}>
                <Layout level='1' style={[styles.leftBox]}>
                <Text {...props} category='s1' style={[styles.modCodeText, {lineHeight: Platform.OS === 'ios' ? 30 : 20}]}>
                {data.modCode}
                </Text>
                <Text status='primary' category='label' style={[styles.modSemText, {lineHeight: Platform.OS === 'ios' ? 15 : 10}]}>
                Sem: {data.semesters}
                </Text>
                </Layout>
                <Text category='p1' style={[styles.modDescText, {lineHeight: Platform.OS === 'ios' ? 30 : 20}]}>
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
        flexDirection: 'column',
        marginHorizontal: 14,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 4,
    },
    header: {
        flex: 1,
        backgroundColor: "darkorange",
        width: "100%",
        height: 3,
        fontSize:5,
    },
    contents: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 6,
        paddingVertical: 10,
    },
    containerShadow: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    leftBox: {
        flex: 2,
        flexDirection: 'column',
    },
    modCodeText: {
        fontWeight: 'bold',
        flex: 1,
        flexDirection: 'row',
        fontFamily: 'Arial',
        textAlign:'left',
        fontSize:12, 
    },
    modSemText: {
        flex: 1,
        textAlign:'left',
        marginBottom: 5,
        fontSize:10,
    },
    modDescText: {
        flex: 5,
        flexWrap: 'wrap',
        flexDirection: 'row',
        fontFamily: 'Arial',
    },
});
