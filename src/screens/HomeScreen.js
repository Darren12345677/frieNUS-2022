import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Pressable,
    Dimensions,
    FlatList,
    ToastAndroid,
    Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
    addDoc,
    onSnapshot,
    query,
    collection,
    doc,
    deleteDoc,
} from 'firebase/firestore';

import { auth, db } from '../firebase';
import { Task } from '../components';

const INPUT_PLACEHOLDER = 'Add your module codes here';
const THEME = 'lightgrey';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const [task, setTask] = useState('');
    const [taskList, setTaskList] = useState([]);
    const currUser = auth.currentUser.uid;

    useEffect(() => {
        // Expensive operation. Consider your app's design on when to invoke this.
        // Could use Redux to help on first application load.
        const taskQuery = query(collection(db, currUser));
        
        const unsubscribe = onSnapshot(taskQuery, (snapshot) => {
            const tasks = [];

            snapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });

            setTaskList([...tasks]);
        });

        return unsubscribe;
    }, [onSubmitHandler]);

    const showRes = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    };

    // https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9
    // https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_7
    const onSubmitHandler = async () => {
        if (task.length === 0) {
            showRes('Task description cannot be empty!');
            return;
        }

        try {
            const taskRef = await addDoc(collection(db, currUser), {
                desc: task,
                completed: false,
            });

            console.log('onSubmitHandler success', taskRef.id);
            showRes('Successfully added task!');
            clearForm();
        } catch (err) {
            console.log('onSubmitHandler failure', err);
            showRes('Failed to add task!');
        }
    };

    const onDeleteHandler = async (id) => {
        try {
            await deleteDoc(doc(db, currUser, id));

            console.log('onDeleteHandler success', id);
            showRes('Successfully deleted task!');
        } catch (err) {
            console.log('onDeleteHandler failure', err);
            showRes('Failed to delete task!');
        }
    };

    const clearForm = () => {
        setTask('');
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>

                    <View style={styles.formContainer}>
                        <TextInput
                            onChangeText={setTask}
                            value={task}
                            selectionColor={THEME}
                            placeholder={INPUT_PLACEHOLDER}
                            style={styles.taskInput}
                        />
                        <Pressable
                            onPress={onSubmitHandler}
                            android_ripple={{ color: 'white' }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>+</Text>
                        </Pressable>
                    </View>


                    <View style={styles.listContainer}>
                        <FlatList
                            data={taskList}
                            renderItem={({ item, index }) => (
                                <Task
                                    data={item}
                                    key={index}
                                    onDelete={onDeleteHandler}
                                />
                            )}
                            style={styles.list}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>



                
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    listContainer: {
        flex: 1,
        paddingBottom: 70, // Fix: Temporary workaround
    },
    list: {
        overflow: 'scroll',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 32,
        marginLeft: 14,
        marginTop: 14,
        marginBottom: 10,
        color: THEME,
    },
    formContainer: {
        flex: 0.075,
        flexDirection: 'row',
        marginHorizontal: 14,
        marginTop: 8,
    },
    taskInput: {
        position: 'absolute',
        width: 340,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'lightgrey',
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginRight: 8,
        backgroundColor: 'white',
    },
    button: {
        position: 'absolute',
        right: 0,
        width: 40,
        height: 40,
        backgroundColor: "#0073e6",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
});
