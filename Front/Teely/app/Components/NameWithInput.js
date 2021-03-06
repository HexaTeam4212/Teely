// app/Components/NameWithInput.js
import React from 'react';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';

export default class NameWithInput extends React.Component {
  constructor(props) {
    super(props)
    this.writtenText=""
  }

  textInputChangedText(text) {
    this.writtenText=text
    this.sendData(this.writtenText)
  }


  sendData(data){
    this.props.parentCallback(data)
  }

  render() {
    const type = this.props.type
    const name = this.props.name
    const placeholder = this.props.placeholder
    const secureTextEntry = this.props.secureTextEntry
    const height = this.props.height
    const value = this.props.value
    const multiline = this.props.multiline
    const maxLength = this.props.maxLength
    const scrollEnabled= this.props.scrollEnabled
    return(
    <View style={styles.main_container} >
        <Text style = {styles.text}> {name}</Text>
        <TextInput maxLength={maxLength} placeholder={placeholder} placeholderTextColor='#d9d9d9' textContentType={type} 
        value={value} secureTextEntry= {secureTextEntry} onChangeText={(text) => this.textInputChangedText(text)}
        style = {[styles.textInput, {height: height}]} multiline={multiline} scrollEnabled={scrollEnabled}/>
        
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
    fontWeight: 'bold',
    fontSize: 16,
    textAlign : 'center',
    color: 'black',
    marginBottom : 5,
    marginRight: 10,
    flexWrap: 'wrap'
  },
  textInput: {
      backgroundColor: 'white',
      textAlign : 'center',
      width: 200,
      borderRadius: 10,
      marginRight: 25,
      flexWrap : 'wrap',
      textAlignVertical: 'center'
    }
});