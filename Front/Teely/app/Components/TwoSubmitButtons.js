// app/Components/TwoSubmitButtons.js
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';

export default class TwoSubmitButtons extends React.Component {
  render() {
    const name1 = this.props.name1
    const name2 = this.props.name2
    //const onPressAction = this.props.onPress
    return(
    <View style={styles.main_container}>
        <TouchableOpacity style = {styles.button}>
            <Text style={styles.buttonText}>{name1}</Text>
        </TouchableOpacity>
        <TouchableOpacity style = {styles.button}>
            <Text style={styles.buttonText}>{name2}</Text>
        </TouchableOpacity>
    </View>

    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    flexDirection : 'row',
    justifyContent: 'space-around',
    alignItems : 'center',
    marginTop : 10,
    marginBottom: 10
    
  },
  buttonText : {
    fontSize: 20,
    color : 'black',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight : 'bold'
  },

  button: {
    padding:10,
    backgroundColor : 'white',
    height: 50,
    width: 150,
    borderRadius : 30,
    justifyContent: 'center',
    alignItems: "center",
  }
});