// app/Views/SignUp.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native'

export default class DetailedGroup extends React.Component {
  constructor(props) {
    super(props)
  }




  render() {
    //const {params} = this.props.navigation.state;
    console.log("params : "+this.props.navigation.state)
    console.log("params2 : "+this.props.navigation)
    //const idGroup = params? params.idGroup : null
    //console.log("idGroup : "+idGroup)
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