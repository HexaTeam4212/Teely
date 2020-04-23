// app/Components/NameWithInput.js
import React from 'react';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';

export default class NameWithInput extends React.Component {
  render() {
    const type = this.props.type
    const name = this.props.name
    const placeholder = this.props.placeholder
    const secureTextEntry = this.props.secureTextEntry
    const height = this.props.height
    const value = this.props.value
    return(
    <View style={styles.main_container} >
        <Text style = {styles.text}> {name}</Text>
        <TextInput placeholder={placeholder} placeholderTextColor='#d9d9d9' textContentType={type} 
        value={value} secureTextEntry= {secureTextEntry} style = {[styles.textInput, {height: height}]}/>
        
    </View>

    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex:1,
    flexDirection : 'row',
    marginTop : 10,
    justifyContent: 'flex-end',
    alignItems: 'center'

  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 16,
    textAlign : 'center',
    color: 'black',
    //marginTop : 10
    //borderBottomWidth : 5
  },
  textInput: {
      backgroundColor: 'white',
      textAlign : 'center',
      width: 200,
      borderRadius: 10,
      marginRight: 25
    }
});