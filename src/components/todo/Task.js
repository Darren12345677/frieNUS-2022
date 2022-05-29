import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const Task = (props) => {
    const { data, onDelete } = props;

    const DeleteIcon = () => (
        <TouchableOpacity onPress={() => onDelete(data.id)}>
            <MaterialIcons name="delete" size={28} color="#407BFF"/>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, styles.containerShadow]}>
        <View style = {[styles.header]} />
            <View style = {[styles.contents]}>
                <Text style={styles.taskText}>{data.desc}</Text>
                <DeleteIcon />
            </View>
        </View>
        
    );
};

export default Task;

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
