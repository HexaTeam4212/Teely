// app/Views/Invitations.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native'

import groupServices from '../Services/GroupServices';
import accountServices from '../Services/AccountServices';
import InvitationItem from '../Components/InvitationItem'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'

export default class Invitations extends React.Component {
  constructor(props) {
    super(props)
    this.invitations = []
    this.selectedInvit;
    this.state = {
      isLoading: true,
      refreshing: false,
      tabInvit: []
    }
    this.getInvitations()
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.getInvitations()
  }

  displayLoading() {
    if (this.state.isLoading) {
        return (
            <View style={styles.loading_container}>
                <ActivityIndicator color='#ffb4e2' size='large' />
            </View>
        )
    }
  }

  resultChoice = (choiceOk) => {
    this.setState({ isLoading: false })
    if (choiceOk) {
      const pos = this.invitations.indexOf(this.selectedInvit)
      this.invitations.splice(pos, 1)
      this.setState({ tabInvit: this.invitations })
    }
  }

  acceptInvitation = (invit) => {
    this.selectedInvit = invit;
    const invitationId = this.selectedInvit.invitationId
    const groupId = this.selectedInvit.groupId

    this.setState({ isLoading: true })
    groupServices.acceptInvitGroup(groupId,invitationId, this.resultChoice)
  }

  declineInvitation = (invit) => {
    this.selectedInvit = invit;
    const groupId = this.selectedInvit.groupId
    
    this.setState({ isLoading: true })
    groupServices.declineInvitGroup(groupId, this.resultChoice)

  }

  updateInvitations = (dataInvit) => {
    this.invitations = dataInvit
    this.setState({
      tabInvit: dataInvit, isLoading: false, refreshing: false
    })
    
  }

  getInvitations() {
    accountServices.accountInvitations(this.updateInvitations)
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
        <KeyboardAwareScrollView
          contentContainerstyle={styles.content_container}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid={true}>

          <FlatList
            data={this.state.tabInvit}
            keyExtractor={(item) => item.invitationId.toString()}
            renderItem={({ item }) =>
              <InvitationItem invitation={item} parentCallbackAccept={this.acceptInvitation}
                parentCallbackDecline={this.declineInvitation} />
            }
          />

        </KeyboardAwareScrollView>

      )
    }
  }


  render() {
    return (
      <View style={styles.main_container}>
        {backgroundGradientColor()}
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            enableOnAndroid={true}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
          >
            <Text style={styles.title_text}>Invitations en attente</Text>
            <View style={styles.content_container}>
              {this.displayInvitations()}
            </View>
          </KeyboardAwareScrollView>
          {this.displayLoading()}
        </View>
        {this.displayLoading()}
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
loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center'
}

});