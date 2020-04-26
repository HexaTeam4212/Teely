// app/Views/CreateGroup.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native'

export default class CreateGroup extends React.Component {
  constructor(props) {
    super(props)
  }




  render() {
    return(
    <View style={styles.main_container}>
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
  main_container : {
    backgroundColor: '#78e1db',
    flex: 1 
  },
  content_container : {
    flex:1,
    marginTop : 30,
    marginBottom : 10,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems: 'center'    
  },
  
});