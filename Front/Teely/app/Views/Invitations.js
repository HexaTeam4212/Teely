// app/Views/SignUp.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native'

export default class Invitations extends React.Component {
  constructor(props) {
    super(props)
    console.log("invitations : "+this.props.navigation.state)
  }

  displayInvitations() {
    if (!(this.invitations.length)) {
      return (
        <View style={styles.noInvit_container}>
          <Text style={styles.text}>Aucune invitation en attente </Text>
        </View>
      )
    }
    else {
      return (
        <FlatList
            data={this.props.navigation.navigate.params.invitations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
            <InvitationItem invitation = {item} />
            }
          />
      )
    }
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
  
});