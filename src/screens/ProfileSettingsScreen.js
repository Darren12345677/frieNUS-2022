import React from 'react'
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
    Autocomplete,
    Avatar,
} from '@ui-kitten/components';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Keyboard, ScrollView} from "react-native";
import { ImprovedAlert, AwaitButton } from '../components';
import { auth, db } from '../firebase';
import {
    doc,
    updateDoc,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMyName } from '../store/myName';
import { setMyCourse } from '../store/myCourse';
import { setMyFaculty } from '../store/myFaculty';
import { setMyYear } from '../store/myYear';
import { setMyAvatar } from '../store/myAvatar';

const REACT_LOGO = "https://reactjs.org/logo-og.png";

const ProfileSettingsScreen = () => {
    const refresh = useSelector(state => state.refresh.refresh);
    const myName = useSelector(state => state.myName.myName);
    const myCourse = useSelector(state => state.myCourse.myCourse);
    const myFaculty = useSelector(state => state.myFaculty.myFaculty);
    const myYear = useSelector(state => state.myYear.myYear);
    const myAvatar = useSelector(state => state.myAvatar.myAvatar);
    const [name, setName] = React.useState(myName);
    const [faculty, setFaculty] = React.useState(myFaculty);
    const [course, setCourse] = React.useState(myCourse);
    const [year, setYear] = React.useState(myYear-1);
    const [avatar, setAvatar] = React.useState(myAvatar);
    const [avatarInput, setAvatarInput] = React.useState(myAvatar);
    const dispatch = useDispatch();
    const reduxSetMyName = (name) => {dispatch(setMyName({input: name})); };
    const reduxSetMyCourse = (course) => {dispatch(setMyCourse({input: course}));};
    const reduxSetMyFaculty = (faculty) => {dispatch(setMyFaculty({input: faculty}));};
    const reduxSetMyYear = (year) => {dispatch(setMyYear({input: year}));};
    const reduxSetMyAvatar = (avatarLink) => {dispatch(setMyAvatar({input: avatarLink}));};
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
            await updateDoc(userDoc, {
                "name" : name,
                "faculty": faculty,
                "course": course,
                "year": year+1,
                "avatar": avatar,
            })
            reduxSetMyName(name);
            reduxSetMyFaculty(faculty);
            reduxSetMyCourse(course);
            reduxSetMyYear(year+1);
            reduxSetMyAvatar(avatar);
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

    const changeImage = () => {
        setAvatar(avatarInput);
        console.log(avatar);
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
                    <Text category='s1'>The image which your friends can see</Text>
                </Layout>
                <Layout style={[styles.container, styles.imageContainer]} level='1'>
                <Avatar defaultSource={require('../assets/image-outline.png')} shape='round' source={{uri: avatar}} style={styles.image}/>
                    <Input
                        style={[styles.imageInput, {backgroundColor:theme['background-basic-color-1']}]}
                        placeholder={"Enter the link to your image here"}
                        value={avatarInput}
                        onChangeText={setAvatarInput}
                        accessoryRight={<Icon onPress={() => {setAvatarInput("")}} name='close-outline'/>}
                        />
                    <Button style={styles.imageButton} onPress={changeImage}>Change image</Button>
                </Layout>
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
                    <RadioGroup selectedIndex={year} onChange={index => setYear(index)}>
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
    imageContainer: {
        flexDirection:'column',
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
    image: {
        marginLeft:20,
        marginVertical:10,
        width:100,
        height:100,
    },
    imageInput: {
        width:'95%',
        margin: 5,
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    imageButton: {
        width:'95%',
        margin:5,
    },
})