import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Layout, Spinner, Text } from '@ui-kitten/components';

const SpinnerView = ({dimWidth, dimHeight}) => {
    console.log(dimWidth);
    console.log(dimHeight);

    return (
    <View style=
        {{backgroundColor: "rgba(9, 31, 89, 0.10)",
        position: 'absolute',
        height: dimHeight,
        width: dimWidth,
        // left: '50%',
        // right: '50%',
        alignItems: 'center',
        justifyContent: 'center',}}>

        <Spinner size='giant'/>
        <Text>Loading</Text>
    </View>
    );
  }
  
  export default SpinnerView;
  
  const styles = StyleSheet.create({
    screen: {
        backgroundColor: "rgba(9, 31, 89, 0.10)",
        position: 'absolute',
        // left: '50%',
        // right: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
  

  //backgroundColor: "rgba(9, 31, 89, 0.10)",