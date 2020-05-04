// app/Components/InputWithName.js
import React from 'react';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';

export default class InputWithName extends React.Component {
  constructor(props) {
    super(props)
    this.writtenText = ""
  }

  textInputChangedText(text) {
    this.writtenText = text
    this.sendData(this.writtenText)
  }


  sendData(data) {
    this.props.parentCallback(data)
  }

  render() {
    const type = this.props.type
    const name = this.props.name
    const placeholder = this.props.placeholder
    const secureTextEntry = this.props.secureTextEntry
    const multiline = this.props.multiline

    return (
      <View style={styles.main_container}>
        <Text style={styles.text}> {name} </Text>
        <TextInput
          placeholder={placeholder} placeholderTextColor='#d9d9d9' textContentType={type}
          onChangeText={(text) => this.textInputChangedText(text)} multiline={multiline}
          secureTextEntry={secureTextEntry} style={styles.textInput} />

      </View>
    )

  }

}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin:15
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginBottom: 5
  },
  textInput: {
    backgroundColor: 'white',
    textAlign: 'center',
    height: "90%",
    width: "60%",
    borderRadius: 10,
    textAlignVertical: 'center'
  }
});