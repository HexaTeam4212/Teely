// app/Views/SignUp.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList } from 'react-native'
import accountServices from '../Services/AccountServices';
import InvitationItem from '../Components/InvitationItem'

export default class Invitations extends React.Component {
  constructor(props) {
    super(props)
    this.invitations = []
    this.selectedInvit;
    this.firstLoad = true
    this.state = {
      isLoading: false,
      tabInvit: []
    }
  }

  resultChoice = (choiceOk) => {
    this.setState({ isLoading: false })
    if (choiceOk) {
      const pos = this.invitations.indexOf(this.selectedInvit)
      this.invitations.splice(pos,1)
      this.setState({tabInvit: this.invitations})
    }
  }

  acceptInvitation = (invit) => {
    this.selectedInvit = invit;
    const invitationId = this.selectedInvit.id
    
    this.setState({ isLoading: true })
    accountServices.accountInvitationChoice(invitationId,'accept',this.resultChoice)
  }

  declineInvitation = (invit) => {
    this.selectedInvit = invit;
    const invitationId = invit.id

    this.setState({ isLoading: true })
    accountServices.accountInvitationChoice(invitationId,'decline',this.resultChoice)
  }
  
  getInvitations(){
    if(this.firstLoad){
      console.log("first load")
      this.invitations = accountServices.accountInvitations()
      this.setState({tabInvit: this.invitations})
      this.firstLoad = false
    }
  }


  displayInvitations() {
    this.getInvitations()
    if (!(this.invitations.length)) {
      return (
        <View style={styles.noInvit_container}>
          <Text style={styles.text}>Aucune invitation en attente </Text>
        </View>
      )
    }
    else {
      return (
        <KeyboardAwareScrollView
          contentContainerstyle={styles.content_container}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid={true}>

          <FlatList
            data={this.state.tabInvit}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
                <InvitationItem invitation={item} parentCallbackAccept={this.acceptInvitation} 
                parentCallbackDecline={this.declineInvitation}/>
            }
          />

        </KeyboardAwareScrollView>

      )
    }
  }


  render() {
    return (
      <View style={styles.main_container}>
          <Text style={styles.title_text}>Invitations en attente</Text>
        <View style={styles.content_container}>
          {this.displayInvitations()}
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#78e1db',
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