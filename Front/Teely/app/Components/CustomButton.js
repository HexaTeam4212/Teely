// app/Components/CustomButton.js
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';

export default class CustomButton extends React.Component {
  render() {
    const name = this.props.name
    const width = this.props.width
    const onPressAction = this.props.onPress
    return(
    <View style={styles.main_container}>
        <TouchableOpacity style = {[styles.button, {width: width}]} onPress = {onPressAction}>
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
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight : 'bold'
  },

  button: {
    padding:10,
    backgroundColor : 'white',
    height: 50,
    //width: 200,
    borderRadius : 30,
    justifyContent: 'center',
    alignItems: "center",
  }
});