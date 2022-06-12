import { TouchableWithoutFeedback, StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { Input, Icon, Text } from '@ui-kitten/components';

const THEME = 'lightgrey';

/*
const AuthTextInput = props => {
    const { secureTextEntry, keyboardType, placeholder, value, textHandler } =
        props;

    return (
        <TextInput
            style={styles.textInput}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={value}
            onChangeText={textHandler}
            selectionColor={THEME}
        />
    );
}; */

 const AuthTextInput = props => {

    
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const { placeholder, keyboardType, value, textHandler } = props;

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    }

    const renderIcon = (props) => {
        return (
            <TouchableWithoutFeedback onPress={toggleSecureEntry}>
                <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <Input
            style={styles.kittenTextInput}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={value}
            onChangeText={textHandler}
            accessoryRight={renderIcon}
        />
    );
};

export default AuthTextInput;

const styles = StyleSheet.create({
    textInput: {
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: THEME,
        borderRadius: 4,
        width: '80%',
        height: 40,
        paddingHorizontal: 8,
        marginBottom: 10
    },
    kittenTextInput: {
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 4,
        width: '80%',
        height: 40,
        paddingHorizontal: 8,
        marginBottom: 10
    }
});
