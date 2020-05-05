// app/Views/CreateTask.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList } from 'react-native'

import accountServices from '../Services/AccountServices';
import InvitationItem from '../Components/InvitationItem'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'

export default class CreatTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    }

  }

  render() {
    return (
        <View style={styles.content_container}>
          {backgroundGradientColor()}
        <KeyboardAwareScrollView
          contentContainerstyle={styles.content_container}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid={true}>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  content_container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    //justifyContent: 'center',
    alignItems: 'center',
  },
  noInvit_container: {
    width: 350,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: '#60dbd3',
  },
  title_text: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 25,
    textAlign: 'center',
    flexWrap: 'wrap',
    marginBottom: 10
  },

});