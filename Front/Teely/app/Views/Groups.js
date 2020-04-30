// app/Views/Groups.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'

import groupServices from '../Services/GroupServices';
import accountServices from '../Services/AccountServices';
import Images from '../modules/ImageProfile';
import ImagesGp from '../modules/ImageGroup';
import GroupItem from '../Components/GroupItem'
import ImageWithText from '../Components/ImageWithText'

export default class Groups extends React.Component {
  constructor(props) {
    super(props)
    this.idImage = ""
    this.groups = []
    this.invitations = []
    this.firstload = true
    this.state = { isLoading: true }

    this.getInvitations()
    this.getDataProfile()
    
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

  updateDataProfile = (dataProfile) => {
    this.idImage = dataProfile.idImage
    this.setState({ isLoading: false })
  }

  getDataProfile = () => {
    accountServices.dataProfile(this.updateDataProfile)
  }

  imageProfile = () => {
    return (
      <Image style={styles.profile} source={Images[this.idImage]} />
    )
  }

 
  displayGroups() {
    this.groups = groupServices.dataGroupsUser()
    if (!(this.groups.length)) {
      return (
        <View style={styles.noGroup_container}>
          <Text style={styles.text}>Vous n'êtes dans aucun groupe pour le moment...</Text>
          <Image style={styles.image_group} source={require('../../assets/Images/noGroup.png')} />
          <Text style={styles.text}>...mais ne vous inquiétez pas, vous pouvez créer votre propre groupe !</Text>
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
            data={this.groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("DetailedGroup", { idGroup: item.id })}>
                <GroupItem group={item.name} image={ImagesGp[item.idImage]} />
              </TouchableOpacity>}
          />
        </KeyboardAwareScrollView>
      )

    }
  }

  updateInvitations = (dataInvit) => {
    this.invitations = dataInvit
  }

  getInvitations() {
    accountServices.accountInvitations(this.updateInvitations)
  }

  displayInvitations() {
    let nbInvit = this.invitations.length

    const title = 'MES INVITATIONS (' + nbInvit + ')'

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate("Invitations", { invitations: this.invitations })}>
        <ImageWithText source={require('../../assets/Images/pinkArrow.png')} text={title} />
      </TouchableOpacity>
    )
  }


  render() {

    return (
      <View style={styles.main_container}>
        <View style={styles.head_container}>
          {this.imageProfile()}
          <View style={styles.title_container}>
            <Text style={styles.title_text}>Mes groupes</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateGroup")}>
              <Image style={styles.image_plus} source={require('../../assets/Images/plus.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content_container}>
          {this.displayGroups()}
        </View>
        <View style={styles.invit_container}>
          {this.displayInvitations()}
        </View>
        {this.displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#78e1db',
    flex: 1
  },
  title_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  content_container: {
    flex: 8,
    marginBottom: 10,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGroup_container: {
    width: 350,
    height: 350,
    margin: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: '#60dbd3',
  },
  head_container: {
    flex: 3,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  invit_container: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  profile: {
    resizeMode: 'contain',
    alignItems: 'center',
    width: 90,
    height: 90,
    borderColor: '#ffb4e2',
    borderWidth: 3,
    borderRadius: 60,
    margin: 10
  },
  title_text: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 25,
    textAlign: 'center',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontStyle: 'italic',
    marginBottom: 5,
    flexWrap: 'wrap'
  },
  image_group: {
    resizeMode: 'contain',
    height: 220,
    width: 300,
    marginBottom: 10,
    marginTop: 5
  },
  image_plus: {
    resizeMode: 'contain',
    height: 60,
    width: 60,
    marginLeft: 10
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },


});