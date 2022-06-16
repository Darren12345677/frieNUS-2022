import { StyleSheet } from 'react-native';
import React from 'react';
import { Text, Button } from '@ui-kitten/components';

const UserResult = ({title}) => {
    return (
        <Button status='primary' appearance='outline' style={styles.rect}>
            <Text status='primary'>{title}</Text>
        </Button>
    );
};

export default UserResult;

const styles = StyleSheet.create({
    rect: {
        padding: 2,
        marginVertical: 8,
        marginHorizontal: 16,
      },
})