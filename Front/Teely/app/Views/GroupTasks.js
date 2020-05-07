// app/Views/GroupTask.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, StyleSheet, Text, View, Image, ActivityIndicator, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import Dialog, { SlideAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

import groupServices from '../Services/GroupServices';
import taskServices from '../Services/TaskServices';
import accountServices from '../Services/AccountServices';
import GroupIcon from '../Components/GroupIcon'
import CustomButton from '../Components/CustomButton';
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'
import GroupTaskItem from '../Components/GroupTaskItem'
import ProfileIcon from '../Components/ProfileIcon'
import MenuDrawer from 'react-native-side-drawer'
import MenuButton from '../Components/MenuButton'
import Images from '../modules/ImageProfile';

export default class GroupTasks extends React.Component {
  constructor(props) {
    super(props)
    this.groupTasks = []
    this.selectedTask;
    this.idGroup = '';
    this.taskDeleted = ''
    this.state = {
      isLoading: true,
      tabGroupTasks: [],
      idImageProfile: 18,
      idImageGroup: 18,
      groupName: '',
      visibleDeleteTaskGroupDialog: false,
      refreshing: false,
      open: false
    }
    let params = this.props.route.params
    this.idGroup = params.idGroup

    this.getGroupData()
    this.getDataProfile()
    this.getGroupTasks()
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getGroupData()
      this.getDataProfile()
      this.getGroupTasks()
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.getGroupData()
    this.getDataProfile()
    this.getGroupTasks()
  }

  getGroupTasks() {
    groupServices.getGroupTasks(this.idGroup, (tasks) => {
      this.groupTasks = tasks
      this.setState({
        tabGroupTasks: tasks, isLoading: false, refreshing: false
      })
    })
  }

  getGroupData() {
    groupServices.getGroupInfos(this.idGroup, (group) => {
      this.setState({
        groupName: group.group_name,
        idImageGroup: group.idImageGroup
      })
    })
  }


  updateDataProfile = (dataProfile) => {
    this.setState({ idImageProfile: dataProfile.idImage })
  }

  getDataProfile = () => {
    accountServices.dataProfile(this.updateDataProfile, "")
  }

  deleteTask = (task) => {
    this.taskDeleted = task
    this.setState({ visibleDeleteTaskGroupDialog: true })

  }

  seeDetails = (task) => {
    this.props.navigation.navigate("DetailedTask", { taskId: task.taskId, idGroup: this.idGroup })

  }

  redirect = (deleteTaskOK) => {
    this.setState({ isLoading: false })
    if (deleteTaskOK) {
      const pos = this.groupTasks.indexOf(this.taskDeleted)
      this.groupTasks.splice(pos, 1)
      this.setState({ tabGroupTasks: this.groupTasks })
    }
  }

  confirmDeletingTask = () => {
    this.setState({ visibleDeleteTaskGroupDialog: false, isLoading: true })
    taskServices.deleteTask(this.taskDeleted.taskId, this.redirect)
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
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        >
          <Dialog dialogStyle={styles.dialog_container}
            visible={this.state.visibleDeleteTaskGroupDialog}
            onTouchOutside={() => {
              this.setState({ visibleDeleteTaskGroupDialog: false })
            }}
            footer={
              <DialogFooter bordered={false} style={styles.dialog_footer} >
                <DialogButton text="Annuler" textStyle={styles.dialogButton_text} style={styles.cancelButton}
                  onPress={() => { this.setState({ visibleDeleteTaskGroupDialog: false }) }} />
                <DialogButton text="Oui" textStyle={styles.dialogButton_text} style={styles.confirmButton}
                  onPress={this.confirmDeletingTask} />
              </DialogFooter>
            }
            dialogAnimation={new SlideAnimation({
              slideFrom: 'bottom',
            })}

          >
            <DialogContent style={styles.dialogContent_container}>
              <Text style={styles.dialog_text}> Etes-vous sûr de vouloir supprimer cette tâche ?</Text>
            </DialogContent>
          </Dialog>
        </KeyboardAwareScrollView>
      </View>
    )
  }


  displayTasks() {
    if (!(this.groupTasks.length)) {
      return (
        <View style={styles.noTask_container}>
          <Text style={styles.text}>Rien à signaler pour le moment... </Text>
          <Image style={{ height: 300, width: 250 }} source={require('../../assets/Images/cat.png')} />
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
            data={this.state.tabGroupTasks}
            keyExtractor={(item) => item.taskId.toString()}
            renderItem={({ item }) => <GroupTaskItem task={item} parentCallbackLoupe={this.seeDetails}
              parentCallbackDelete={this.deleteTask} />}
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
              <View style={styles.icon_container}>
                <TouchableOpacity onPress={this.toggleOpen}>
                  <Image style={styles.profil} source={Images[this.state.idImageProfile]} />
                </TouchableOpacity>
              </View>
              <View style={styles.head_container}>
                <GroupIcon idImage={this.state.idImageGroup} />
                <Text style={styles.name_text}>{this.state.groupName}</Text>
              </View>
              <View style={styles.content_container}>
                {this.displayTasks()}
              </View>
              <View style={styles.button_container}>
                <CustomButton name="Ajouter une tâche" width={180} onPress={() => {
                  this.props.navigation.navigate("CreateTask", { idGroup: this.idGroup })
                }}></CustomButton>
                <TouchableOpacity style={styles.inviteButton} onPress={() => {
                  this.props.navigation.navigate("PlanningDetails", { idGroup: this.idGroup })
                }}>
                  <Text style={styles.inviteButtonText}>Lancer l'organisation</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginBottom: 80 }}></View>
            </KeyboardAwareScrollView>
          </MenuDrawer>
          {this.displayLeaveGroupDialog()}
          {this.displayLoading()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  icon_container: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    zIndex: 5
  },
  head_container: {
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  content_container: {
    flex: 6,
    flexDirection: 'column',
  },
  button_container: {
    flex: 1.3,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTask_container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 15,
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
  text: {
    fontStyle: 'italic',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'Roboto',
    fontSize: 20,
    textAlign: 'left',
    flexWrap: 'wrap'
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
    marginRight: 15,
    backgroundColor: '#ffb4e2',
    width: 150,
    height: 70,
    borderColor: '#737373',
    borderRightWidth: 3,
    borderBottomWidth: 5
  },
  profil: {
    resizeMode: 'contain',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderColor: '#ffb4e2',
    borderWidth: 3,
    borderRadius: 60,
    margin: 10
  },
  menu: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#ffb4e2",
    padding: 0
  },


});