// app/Views/DetailedGroup.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, YellowBox, StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'
import Dialog, { SlideAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

import groupServices from '../Services/GroupServices'
import ImagesGroup from '../modules/ImageGroup'
import ImageWithText from '../Components/ImageWithText'
import ProfileIcon from '../Components/ProfileIcon'
import GroupIcon from '../Components/GroupIcon'
import accountServices from '../Services/AccountServices'
import MenuButton from '../Components/MenuButton'
import MenuDrawer from 'react-native-side-drawer'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'



YellowBox.ignoreWarnings([
  'componentWillReceiveProps has been renamed, and is not recommended for use'
])

export default class DetailedGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      idImageProfile: 18,
      name: "",
      description: "",
      idImageGroup: 18,
      members: [],
      isLoading: true,
      refreshing: false,
      visibleLeaveGroupDialog: false,
      usernameInput: "",
      usernameList: [],
      invitedUser: [],
      open : false
    }
    this.isUsernameValid = true
    let params = this.props.route.params
    this.groupId = params.idGroup
    this.reload = params.reload
    this.getDataProfile()
    this.getGroupInfos()

  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.getDataProfile()
    this.getGroupInfos()
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getDataProfile()
      this.getGroupInfos()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
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

  displayLeaveGroupDialog = () => {
    return (
      <View>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={false}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid={true}
        >
          <Dialog dialogStyle={styles.dialog_container}
            visible={this.state.visibleLeaveGroupDialog}
            onTouchOutside={() => {
              this.setState({ visibleLeaveGroupDialog: false })
            }}
            footer={
              <DialogFooter bordered={false} style={styles.dialog_footer} >
                <DialogButton text="Annuler" textStyle={styles.dialogButton_text} style={styles.cancelButton}
                  onPress={() => { this.setState({ visibleLeaveGroupDialog: false }) }} />
                <DialogButton text="Oui" textStyle={styles.dialogButton_text} style={styles.confirmButton}
                  onPress={this.confirmLeavingGroup} />
              </DialogFooter>
            }
            dialogAnimation={new SlideAnimation({
              slideFrom: 'bottom',
            })}

          >
            <DialogContent style={styles.dialogContent_container}>
              <Text style={styles.dialog_text}> Etes-vous sûr de vouloir quitter ce groupe ?</Text>
            </DialogContent>
          </Dialog>
        </KeyboardAwareScrollView>
      </View>
    )
  }

  redirect = (leaveGroupOK) => {
    this.setState({ isLoading: false })
    if (leaveGroupOK == true) {
      this.props.navigation.navigate("Groups")
    }
  }

  confirmLeavingGroup = () => {
    this.setState({ visibleLeaveGroupDialog: false, isLoading: true })
    groupServices.leaveGroup(this.groupId, this.redirect)
  }


  updateGroupInfos = (data) => {
    this.setState({
      name: data.group_name, description: data.description, idImageGroup: data.idImageGroup,
      members: data.members, isLoading: false, refreshing: false
    });
  }

  getGroupInfos = () => {
    groupServices.getGroupInfos(this.groupId, this.updateGroupInfos)
  }

  leaveGroup = () => {
    this.setState({ visibleLeaveGroupDialog: true })
  }


  imageGroup = () => {
    return (
      <Image style={styles.groupPic} source={ImagesGroup[this.state.idImageGroup]} />
    )
  }

  updateDataProfile = (dataProfile) => {
    this.setState({ idImageProfile: dataProfile.idImage })
  }

  getDataProfile = () => {
    accountServices.dataProfile(this.updateDataProfile, "")
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
            <GroupIcon idImage={this.state.idImageGroup} />
            <Text style={styles.name_text}>{this.state.name}</Text>
            <Text style={styles.description_text} numberOfLines={4}> {this.state.description}</Text>
            <Text style={styles.participant_text}>{this.state.members.length} participants</Text>
            <TouchableOpacity style={styles.editButton} onPress={() =>
              this.props.navigation.navigate("EditGroup", {
                idGroup: this.groupId, idImageProfile: this.state.idImageProfile, description: this.state.description,
                idImageGroup: this.state.idImageGroup, name: this.state.name
              })}>
              <Image style={styles.editImage} source={require('../../assets/Images/edit.png')} />
            </TouchableOpacity>

            <View style={styles.arrows_container}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate("GroupCalendar", { idGroup: this.groupId })}>
                <ImageWithText source={require('../../assets/Images/yellowArrow.png')} text='CALENDRIER' />
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate("GroupTasks", { idGroup: this.groupId })}>
                <ImageWithText source={require('../../assets/Images/pinkArrow.png')} text='TACHES' />
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1 }}
                onPress={() => this.props.navigation.navigate("GroupMembers", { idGroup: this.groupId })}>
                <ImageWithText source={require('../../assets/Images/greenArrow.png')} text='PARTICIPANTS' />
              </TouchableOpacity>
            </View>
            <View style={styles.buttons_container}>
              <TouchableOpacity style={styles.leaveGroupButton} onPress={this.leaveGroup}>
                <Text style={styles.button_text}>Quitter le groupe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inviteButton} onPress={() => { this.props.navigation.navigate("InviteMembers", { idGroup: this.groupId }) }}>
                <Text style={styles.inviteButtonText}>Inviter des participants</Text>
              </TouchableOpacity>
            </View>
            </KeyboardAwareScrollView>
            </MenuDrawer>
            {this.displayLoading()}
            {this.displayLeaveGroupDialog()}
        </View>
      </View >
    )
  }
}



const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  content_container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  head_container: {
    flex: 2,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  arrows_container: {
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  buttons_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 85,
    marginTop: 10
  },
  foot_container: {
    flexDirection: 'row',
    alignItems: 'flex-end'
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
  dialog_container: {
    backgroundColor: '#ffb4e2',
    borderColor: '#78e1db',
    borderWidth: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialogContent_container: {
    margin: 20,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dialog_footer: {
    margin: 5
  },
  name_text: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
    flexWrap: 'wrap'
  },
  description_text: {
    fontStyle: 'italic',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'Roboto',
    fontSize: 20,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  participant_text: {
    fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    flexWrap: 'wrap'
  },
  button_text: {
    fontSize: 20,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    textAlign: 'center'
  },
  inviteButtonText: {
    fontSize: 22,
    color: '#737373',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  dialog_text: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center'
  },
  dialogButton_text: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
    alignSelf: 'center'
  },
  textInput: {
    backgroundColor: 'white',
    height: 40,
    width: 200,
    alignSelf: 'center',
    marginTop: 20
  },
  editButton: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end'
  },
  editImage: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  leaveGroupButton: {
    padding: 5,
    backgroundColor: 'red',
    width: 120,
    height: 60,
    borderRadius: 35,
  },
  confirmButton: {
    margin: 5,
    padding: 5,
    borderRadius: 40,
    backgroundColor: '#3bd137',
  },
  cancelButton: {
    margin: 5,
    padding: 5,
    borderRadius: 40,
    backgroundColor: '#ff443a',
  },
  inviteButton: {
    padding: 5,
    backgroundColor: '#ffb4e2',
    width: 140,
    height: 70,
    borderColor: '#737373',
    borderRightWidth: 3,
    borderBottomWidth: 5
  },
  menu: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#ffb4e2",
    padding: 0
  },

})