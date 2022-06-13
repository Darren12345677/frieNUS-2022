import {
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Pressable,
    Dimensions,
    FlatList,
    ToastAndroid,
    Keyboard,
    TouchableOpacity,
    Image,
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

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import { Module } from '../components';
import { 
    Avatar, 
    Icon, 
    Text, 
    Button, 
    Divider, 
    Layout, 
    TopNavigation, 
    List, 
    ListItem, 
} from '@ui-kitten/components';

const SearchScreen = () => (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text category='h1'>Search</Text>
    </Layout>
    );

export default SearchScreen;