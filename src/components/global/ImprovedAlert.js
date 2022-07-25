import { useEffect } from 'react';
import { Alert } from 'react-native';

//This is a wrapper Alert that can be easily called upon.
function ImprovedAlert (logMsg, mainMsg) {
    console.log(`${logMsg}`);
    Alert.alert(`${mainMsg}`, "", [{ text:"Dismiss", onPress: () => console.log("Dismissed")}]);
  }
  
  export default ImprovedAlert;