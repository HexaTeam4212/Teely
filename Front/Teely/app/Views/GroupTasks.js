// app/Views/GroupTask.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import groupServices from '../Services/GroupServices';
import accountServices from '../Services/AccountServices';
import ImagesProfile from '../modules/ImageProfile'
import CustomButton from '../Components/CustomButton';

export default class GroupTasks extends React.Component {
  constructor(props) {
    super(props)
    this.groupTasks = []
    this.selectedTask;
    this.idGroup = '1';
    this.state = {
      isLoading: true,
      tabGroupTasks: [],
      idImageProfile: '',
      groupName:''
    }
    this.getGroupId() 
    this.getGroupData()
    this.getDataProfile()
    this.getGroupTasks()
  }

  getGroupId() {
    let params = this.props.route.params
    this.groupId = params.idGroup
  }

  getGroupTasks() {
    groupServices.getGroupTasks(this.idGroup, (tasks) => {
      this.groupTasks = tasks
      this.setState({
        tabGroupTasks: tasks, isLoading: false
      })
    })
  }

  getGroupData(){
    groupServices.getGroupInfos(this.idGroup, (group) => {
      this.setState({
        groupName: group.group_name
      })
    })
  }

  updateDataProfile = (dataProfile) => {
    this.setState({ idImageProfile: dataProfile.idImage })
  }

  getDataProfile = () => {
    accountServices.dataProfile(this.updateDataProfile, "")
  }

  imageProfile = () => {
    return (
      <Image style={styles.profile} source={ImagesProfile[this.state.idImageProfile]} />
    )
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

  displayTasks() {
    console.log("invit : " + this.groupTasks.length)
    if (!(this.groupTasks.length)) {
      return (
        <View style={styles.noTask_container}>
          <Text style={styles.text}>Rien à signaler pour le moment... </Text>
          <Image style={{ height: 350, width: 300 }} source={require('../../assets/Images/cat.png')} />
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

        </KeyboardAwareScrollView>

      )
    }
  }


  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.head_container}>
          <View style={styles.image_container}>
            {this.imageProfile()}
          </View>
          <View style={styles.title_container}>
            <View style={styles.name_container}>
              <Text style={styles.title_text}>{'Tâches du groupe :'}</Text>
            </View>
            <View style={styles.nameBis_container}>
              <Text style={styles.name_text}>{this.state.groupName}</Text>
            </View>
          </View>
        </View>
        <View style={styles.content_container}>
          {this.displayTasks()}
        </View>
        <View style={styles.button_container}>
            <CustomButton name="Ajouter une tâche" width={180} onPress={() => {
            this.props.navigation.navigate("CreateTask", {idGroup : this.idGroup})
          }}></CustomButton>
            <CustomButton name="Organiser" width={180}></CustomButton>
        </View>
        {this.displayLoading()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#78e1db',
    flex: 1,
  },
  head_container: {
    flex: 1.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image_container: {
    flex: 1,
    marginLeft: 5,
    justifyContent: 'flex-start'
  },
  title_container: {
    flex: 4,
    flexDirection: 'column',
    flexWrap: 'wrap'

  },
  name_container: {
    flex: 4,
    alignItems: 'flex-start',

  },
  nameBis_container: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content_container: {
    flex: 6,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  button_container: {
    flex: 1,
    flexDirection:'row',
    marginBottom: 10
  },
  noTask_container: {
    flex:1,
    width: 350,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: '#60dbd3',
  },
  profile: {
    marginTop: 5,
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 70,
    height: 70,
    borderColor: '#ffb4e2',
    borderWidth: 3,
    borderRadius: 50,
    marginBottom: 20,
  },
  title_text: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 25,
    textAlign: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
    marginLeft: 10,
  },
  name_text: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 20,
    textAlign: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
    marginLeft: 10,
  },
  text: {
    fontStyle: 'italic',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'Roboto',
    fontSize: 20,
    textAlign: 'left',
    flexWrap: 'wrap'
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