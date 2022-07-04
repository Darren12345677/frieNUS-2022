import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { default as theme } from './fixed-theme.json';

import GlobalStyles from './src/styles/GlobalStyles';
import { SafeAreaView } from "react-native";
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { CustomIconPack } from './src/assets/CustomIconPack'

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store/store';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

console.log("App start");

export default App = () => {
    return (
        <>
            <Provider store={store}>
            <IconRegistry icons={[EvaIconsPack, CustomIconPack]} />
            <SafeAreaView style={GlobalStyles.droidSafeArea}>
            <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme}}>
                <AppNavigator />
                <StatusBar style='auto' />
            </ApplicationProvider>
            </SafeAreaView>
            </Provider>
        </>
    );
};