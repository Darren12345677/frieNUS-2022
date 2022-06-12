import { View, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Text, Button } from '@ui-kitten/components';

/* const AuthPressable = props => {
    const { onPressHandler, title } = props;

    return (
        <Pressable
            style={styles.button}
            onPress={onPressHandler}
            android_ripple={{ color: '#FFF' }}
        >
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}; */

const AuthPressable = (props) => {
  const { onPressHandler, title } = props;

  return (
    <Button
      onPress={onPressHandler}
      appearance='outline'
      style={[styles.kButton]}
      status='primary'
      >
      {evaProps => <Text {...evaProps} style={[styles.texty]}> {title} </Text>}
    </Button>
  )
}

export default AuthPressable;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0073e6',
        marginVertical: 5,
        paddingVertical: 10,
        width: '80%',
        height: 40,
        alignItems: "center",
        borderRadius: 4
    },
    texty: {
        fontFamily: 'Avenir',
        textAlign:"center",
    },
    kButton: {
        marginVertical: 5,
        paddingVertical: 5,
        width: '75%',
        height: '5%',
        alignItems: "center",
        borderRadius: 50,
        color: 'black'
    }
});
