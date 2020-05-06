// app/Components/MenuButton.js
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';

export default class MenuButton extends React.Component {
  render() {
    const name = this.props.name
    const width = this.props.width
    const onPressAction = this.props.onPress
    return (
      <View style={styles.main_container}>
        <TouchableOpacity style={[styles.button, { width: width }]} onPress={onPressAction}>
          <Text style={styles.buttonText}>{name}</Text>
        </TouchableOpacity>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 30
  },
  buttonText: {
    fontSize: 20,
    padding: 10,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight: 'bold'
  },
  button: {
    padding: 0,
    backgroundColor: '#78e1db',
    height: 60,
    justifyContent: 'center',
    alignItems: "flex-start",
  }
});