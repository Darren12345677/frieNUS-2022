import React, {useCallback} from 'react'
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
    useTheme,
    RadioGroup,
    Radio,
    Autocomplete
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Keyboard, ScrollView} from "react-native";
import { LogoutButton, ImprovedAlert, AwaitButton } from '../components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import {
    collection,
    doc,
    deleteDoc,
    onSnapshot,
    query, 
    updateDoc,
    getDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMyName } from '../store/myName';
import { setMyCourse } from '../store/myCourse';
import { setMyFaculty } from '../store/myFaculty';
import { setMyYear } from '../store/myYear';

const ProfileSettingsScreen = () => {
    const refresh = useSelector(state => state.refresh.refresh);
    const myName = useSelector(state => state.myName.myName);
    const myCourse = useSelector(state => state.myCourse.myCourse);
    const myFaculty = useSelector(state => state.myFaculty.myFaculty);
    const myYear = useSelector(state => state.myYear.myYear);
    const [name, setName] = React.useState(myName);
    const [faculty, setFaculty] = React.useState(myFaculty);
    const [course, setCourse] = React.useState(myCourse);
    const [year, setYear] = React.useState(myYear-1);
    const dispatch = useDispatch();
    const reduxSetMyName = (name) => {dispatch(setMyName({input: name})); };
    const reduxSetMyCourse = (course) => {dispatch(setMyCourse({input: course}));};
    const reduxSetMyFaculty = (faculty) => {dispatch(setMyFaculty({input: faculty}));};
    const reduxSetMyYear = (year) => {dispatch(setMyYear({input: year}));};
    const theme = useTheme();

    useEffect(() => {
        // fetch('https://luminus.azure-api.net/setting/Faculty')
        // .then(res => res.json())
        // .then(data => {
        //     const arr = [];
        //     console.log(data);
        //     data.forEach(mod => {
        //         arr.push(mod)
        //     })
        //     setFacultyList(arr)})
        // .catch(error => console.log(error));
        // console.log(facultyList)
    }, [refresh]);

    const emptyAlert = () => {
        ImprovedAlert("Display name input is empty", "Display name cannot be empty!");
    };

    const saveAlert = () => {
        ImprovedAlert("Changes have been saved successfully", "Changes have been saved");
    };

    const saveHandler = async () => {
        const currUser = auth.currentUser;
        const userDoc = doc(db, 'Users/' + currUser.uid);
        if (name.length == 0) {
            emptyAlert();
        } else {
            reduxSetMyName(name);
            reduxSetMyFaculty(faculty);
            reduxSetMyCourse(course);
            reduxSetMyYear(year+1);
            await updateDoc(userDoc, {
                "name" : myName,
                "faculty": myFaculty,
                "course": myCourse,
                "year": myYear,
            })
            Keyboard.dismiss();
            saveAlert();
        }
    }

    // const [course, setCourse] = React.useState('');
    // const [courseList, setCourseList] = React.useState([]);
    // const [autoCourseArr, setAutoCourseArr] = React.useState([]);
    // const filter = (item, query) => item.moduleCode.toLowerCase().includes(query.toLowerCase());
    // const onSelect = (index) => {
    //     setModule(autoArr[index].moduleCode);
    //     Keyboard.dismiss();
    // };
    // const onChangeText = (query) => {
    //   setModule(query);
    //   setAutoArr(nusmods.filter(item => filter(item, query)));
    // };
    // const renderOption = (item, index) => (
    //   <AutocompleteItem
    //     key={index}
    //     title={item.moduleCode}
    //   />
    // );

    const SaveButton = () => {
        return (
            <AwaitButton awaitFunction={saveHandler} children={"Save"} style={styles.saveButton}/>
        )
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <KeyboardAvoidingView style={{flex:1}}>
                <TopNavigation 
                title='Profile Settings'
                alignment='start'
                accessoryLeft={<Icon name='settings-outline' fill={theme['color-info-900']} style={{marginLeft:5, height:32, width:32, marginRight:10,}} />}
                accessoryRight={<SaveButton/>}
                style={{height:'8%'}}
                />
                <Divider/>
                <ScrollView>
                <Layout level='2' style={styles.screen}>
                <Layout level='4' style={styles.ribbon}>
                    <Text category='s1'>The name which your friends can see</Text>
                </Layout>
                <Layout style={[styles.container, styles.displayNameContainer]} level='1'>
                    <Input
                        style={[styles.displayNameInput, {backgroundColor:theme['background-basic-color-1']}]}
                        placeholder={"Enter your display name here"}
                        value={name}
                        onChangeText={setName}/>
                </Layout>
                <Layout level='4' style={styles.ribbon}>
                    <Text category='s1'>The faculty you study in</Text>
                </Layout>
                <Layout style={[styles.container, styles.facultyContainer]} level='1'>
                    <Input
                        style={[styles.displayNameInput, {backgroundColor:theme['background-basic-color-1']}]}
                        placeholder={"Enter your faculty here"}
                        value={faculty}
                        onChangeText={setFaculty}/>
                </Layout>
                <Layout level='4' style={styles.ribbon}>
                    <Text category='s1'>The course you are pursuing</Text>
                </Layout>
                <Layout style={[styles.container, styles.courseContainer]} level='1'>
                    <Input
                        style={[styles.displayNameInput, {backgroundColor:theme['background-basic-color-1']}]}
                        placeholder={"Enter your course here"}
                        value={course}
                        onChangeText={setCourse}/>
                    {/* <Autocomplete
                        placeholder={"Enter your course here"}
                        value={course}
                        onSelect={onSelect}
                        onChangeText={onChangeText}
                        placement='bottom'
                        accessoryLeft={<Icon name='book-open-outline'/>}
                        accessoryRight={module.length != 0 ? <Icon name='close-outline' onPress={() => {
                            console.log('Pressed');
                            setModule("");
                            Keyboard.dismiss();
                        }}/> : null}
                        onBlur={() => setAutoArr(nusmods)}
                        style={[styles.AC, {marginTop:24, marginBottom:20}]}
                        >
                        {autoArr.map(renderOption)}
                        </Autocomplete> */}
                </Layout>
                <Layout level='4' style={styles.ribbon}>
                    <Text category='s1'>The current year you are in</Text>
                </Layout>
                <Layout style={[styles.container, styles.yearContainer]} level='1'>
                    <Text category='label'>
                        {`Selected Year: ${year + 1}`}
                    </Text>
                    <RadioGroup
                        selectedIndex={year}
                        onChange={index => setYear(index)}
                        >
                        <Radio>Year 1</Radio>
                        <Radio>Year 2</Radio>
                        <Radio>Year 3</Radio>
                        <Radio>Year 4</Radio>
                        <Radio>Year 5</Radio>
                    </RadioGroup>
                </Layout>
                </Layout>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ProfileSettingsScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width:'100%',
    },
    ribbon: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
        marginVertical: 10,
    },
    container: {
        marginHorizontal: 5,
        marginVertical: 10,
    },
    displayNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        paddingVertical: -1,
        marginHorizontal: 10,
    },
    displayNameInput: {
        width:'70%',
        margin: 5,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    yearContainer: {
        flexDirection: 'column',
        justifyContent:'flex-start',
        marginLeft: 10,
        paddingLeft: 10,
    },
})