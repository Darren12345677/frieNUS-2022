import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button } from '@ui-kitten/components';

const AuthPressable = (props) => {
  const { onPressHandler, title, iconLeft, iconRight } = props;

  return (
    <Button
      onPress={onPressHandler}
      appearance='outline'
      style={[styles.kButton]}
      status='primary'
      accessoryLeft={iconLeft}
      accessoryRight={iconRight}
      >
      {evaProps => <Text {...evaProps} status='warning' category='p1'> {title} </Text>}
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
        // color: 'blue'
    }
});
