import { View, StyleSheet } from 'react-native';
import React from 'react';
import { Layout, Spinner, Text } from '@ui-kitten/components';

const SpinnerView = ({dimWidth, dimHeight}) => {

    return (
    <Layout style=
        {{backgroundColor: "rgba(9, 31, 89, 0.15)",
        position: 'absolute',
        height: dimHeight,
        width: dimWidth,
        alignItems: 'center',
        justifyContent: 'center',}}>
      <Layout level='1' style={{justifyContent:'center', alignItems:'center', padding:20, borderRadius:60}}>
        <Spinner status='primary' size='giant'/>
        <Text category='h6' style={{paddingTop:20}} >Loading</Text>
      </Layout>
    </Layout>
    );
  }
  
  export default SpinnerView;
  
  const styles = StyleSheet.create({
    screen: {
        backgroundColor: "rgba(9, 31, 89, 0.10)",
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
  
  //backgroundColor: "rgba(9, 31, 89, 0.10)",