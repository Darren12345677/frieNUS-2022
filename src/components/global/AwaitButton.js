import React from 'react';
import { Button } from '@ui-kitten/components';
import { useDispatch } from 'react-redux';
import { setLoadingTrue, setLoadingFalse } from '../../store/loading';
import { setRefreshTrue, } from '../../store/refresh';

//Unfortunately since Redux only works with Functional Components and not functions,
//The following code cannot exist as an imported function.
//This is a wrapper component for buttons that call functions that return a promise.
//Do not use setTimeout to test async functions as the promise is resolved before
//the timeout ends.

const AwaitButton = (props) => {
  const {awaitFunction} = props;
  const dispatch = useDispatch();
  const reduxLoadingTrue = () => {dispatch(setLoadingTrue());};
  const reduxLoadingFalse = () => {dispatch(setLoadingFalse());};
  const reduxRefreshTrue = () => {dispatch(setRefreshTrue());};

  const Wait = () => {
    // console.log("Wait starts");
    //This is to convert the awaitFunction into an async function again
    //This is done because JS is a weakly typed language
    const asyncAwaitFunction = async () => {
        return awaitFunction();
    }
    reduxLoadingTrue();
    asyncAwaitFunction().then(res => {
        // console.log("Wait is done");
    }).catch(err => {
      console.log("Error encountered in Wait Block");
      console.log(err);
    }).finally(() => {
      reduxRefreshTrue();
      reduxLoadingFalse();
    })
}


  return (
    //With the spread operator, we can treat the AwaitButton as a normal button
    <Button style = {{marginBottom:5}} {...props} onPress={Wait}></Button>
  );
}
  
  export default AwaitButton;
  

  