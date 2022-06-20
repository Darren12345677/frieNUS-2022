import { TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React from 'react';
import { Input, Icon } from '@ui-kitten/components';

const THEME = 'lightgrey';

 const AuthTextInput = props => {

    
    const [secureTextEntry, setSecureTextEntry] = React.useState(false);

    const { placeholder, keyboardType, value, textHandler } = props;

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    }

    const renderIcon = (props) => {
        return (
            <TouchableWithoutFeedback onPress={toggleSecureEntry}>
                <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye' } pack='eva'/>
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
