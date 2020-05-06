// app/Views/Groups.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'

import groupServices from '../Services/GroupServices';
import accountServices from '../Services/AccountServices';
import ImagesGroup from '../modules/ImageGroup'
import GroupItem from '../Components/GroupItem'
import ImageWithText from '../Components/ImageWithText'
import ProfileIcon from '../Components/ProfileIcon'
import MenuButton from '../Components/MenuButton'
import MenuDrawer from 'react-native-side-drawer'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'

export default class Groups extends React.Component {
  constructor(props) {
    super(props)
    this.idImageProfile = 18
    this.groups = []
    this.invitations = []
    this.nbInvit = 0
    this.firstload = true
    this.state = { isLoading: true, refreshing: false, idImageProfile: 18, open: false }

    this.getInvitations()
    this.getDataProfile()
    this.getGroups()

  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      this.onRefresh()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.getInvitations()
    this.getGroups()
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
    this.setState({ idImageProfile: dataProfile.idImage })
    this.setState({ isLoading: false })
  }

  getDataProfile = () => {
    accountServices.dataProfile(this.updateDataProfile, "")
  }

  getInvitations() {
    accountServices.accountInvitations((dataInvit) => {
      this.invitations = dataInvit
      this.nbInvit = dataInvit.length
    })

  }

  getGroups() {
    groupServices.getGroupsUser((groupIds) => {
      this.groups = groupIds
      this.setState({ isLoading: false, refreshing: false })
    })
  }

  displayInvitations() {

    const title = 'MES INVITATIONS (' + this.nbInvit + ')'

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate("Invitations")}>
        <ImageWithText source={require('../../assets/Images/pinkArrow.png')} text={title} />
      </TouchableOpacity>
    )
  }

  displayGroups() {
    if (this.groups.length === 0) {
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
            keyExtractor={(item) => item.groupId.toString()}
            renderItem={({ item }) =>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("DetailedGroup", { idGroup: item.groupId })}>
                <GroupItem group={item.group_name} image={ImagesGroup[item.idImageGroup]} />
              </TouchableOpacity>}
          />
        </KeyboardAwareScrollView>
      )
    }
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  }

  drawerContent = () => {
    return (
      <ScrollView style={styles.menu}>
        <TouchableOpacity onPress={this.toggleOpen} style={{ flex: 1, marginBottom: 60 }} >
          <ProfileIcon idImage={this.state.idImageProfile} />
        </TouchableOpacity>
        <View style={{ flex: 12 }}>
          <MenuButton name='Profil' width={'95%'} onPress={() => this.props.navigation.navigate("Profile")} />
          <MenuButton name='Calendrier' width={'95%'} onPress={() => this.props.navigation.navigate("PersonalCalendar")} />
          <MenuButton name='Groupes' width={'95%'} onPress={() => this.props.navigation.navigate("Groups")} />
          <MenuButton name='Invitations' width={'95%'} onPress={() => this.props.navigation.navigate("Invitations", { invitations: this.invitations })} />
          <MenuButton name='Paramètres' width={'95%'} onPress={() => this.props.navigation.navigate("EditProfile")} />
          <MenuButton name='Déconnexion' width={'95%'} onPress={() => {
            accountServices.logout()
            this.props.navigation.navigate("Login")
          }} />
        </View>
      </ScrollView>
    )
  }


  render() {
    return (
      <View style={styles.main_container}>
        {backgroundGradientColor()}
        <View style={{ flex: 1 }}>
          <MenuDrawer
            open={this.state.open}
            drawerContent={this.drawerContent()}
            drawerPercentage={55}
            animationTime={200}
            overlay={false}
            opacity={0.2}
          >
            <KeyboardAwareScrollView
              contentContainerStyle={{ flex: 1 }}
              resetScrollToCoords={{ x: 0, y: 0 }}
              scrollEnabled={true}
              enableAutomaticScroll={(Platform.OS === 'ios')}
              enableOnAndroid={true}
              refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
            >
              <TouchableOpacity onPress={this.toggleOpen} >
                <ProfileIcon idImage={this.state.idImageProfile} />
              </TouchableOpacity>
               
                <View style={styles.title_container}>
                  <Text style={styles.title_text}>Mes groupes</Text>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateGroup")}>
                    <Image style={styles.image_plus} source={require('../../assets/Images/plus.png')} />
                  </TouchableOpacity>
                </View>
                <View style={styles.content_container}> 
                  {this.displayGroups()}
                </View>
                <View style={styles.invit_container}>
                {this.displayInvitations()}
                </View>
            </KeyboardAwareScrollView>
          </MenuDrawer>
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
  title_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginLeft: 80
  },
  content_container: {
    flex: 5,
    marginBottom: 5,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGroup_container: {
    width: 350,
    height: 350,
    margin:5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 15,
  },
  invit_container: {
    flex: 1.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom:70,
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
  menu: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#ffb4e2",
    padding: 0
  },

});