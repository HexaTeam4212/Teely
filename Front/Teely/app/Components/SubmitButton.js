// app/Components/SubmitButton.js
import React from 'react';
import signUpService from '../Services/SignUpService'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export default class SubmitButton extends React.Component {
  render() {
    const name = this.props.name
    const onPressAction = this.props.onPress
    return(
    <View style={styles.main_container}>
        <TouchableOpacity style = {styles.button} onPress = {onPressAction}>
            <Text style={styles.buttonText}>{name}</Text>
        </TouchableOpacity>
    </View>

    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems : 'center',
    marginTop : 20
    
    
  },
  buttonText : {
    fontSize: 20,
    color : 'black',
    fontFamily:'Cochin',
    fontWeight : 'bold'
  },

  button: {
    padding:10,
    backgroundColor : 'white',
    height: 50,
    width: 200,
    borderRadius : 30,
    justifyContent: 'center',
    alignItems: "center",
  }
});