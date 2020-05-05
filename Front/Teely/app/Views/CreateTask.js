// app/Views/CreateTask.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, TextInput, ActivityIndicator, FlatList, Image, Picker, TouchableOpacity } from 'react-native'
import accountServices from '../Services/AccountServices'
import groupServices from '../Services/GroupServices'
import ProfileIcon from '../Components/ProfileIcon'
import NameWithInput from '../Components/NameWithInput'
import ImagesGroup from '../modules/ImageGroup'
import DateTimePicker from '../Components/DateTimePicker'
import TaskItem from '../Components/TaskItem'
import CustomButton from '../Components/CustomButton'
import generalServices from '../Services/GeneralServices'

export default class CreateTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      idImageProfile: 18,
      idImageGroup: 18,
      groupName: "",
      taskName: "",
      taskDescription: "",
      taskUser: "",
      groupMembers: [],
      taskDependencies: [],
      datetimeStart: "",
      datetimeEnd: "",
      taskDuration: "",
      taskPrioriy: "",
      groupTasks: [],
      isLoading: true
    }
    this.selectedPriority = "Basse"
    this.groupId = this.props.route.params.idGroup
    this.userSelection = new Map()
    this.taskSelection = new Map()
    this.getDataProfile()
    this.getGroupInfos()
    this.getGroupTasks()
    this.initSelection()

  }


  initSelection() {
    for (let i = 0; i < this.state.groupMembers.length; i++) {
      this.userSelection.set(this.state.groupMembers[i], false)
    }
    for (let i = 0; i < this.state.groupTasks.length; i++) {
      this.taskSelection.set(this.state.groupMembers[i].taskId, false)
    }
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

  updateGroupInfos = (data) => {
    this.setState({
      groupName: data.name, idImageGroup: data.idImageGroup, groupMembers: data.members,
      isLoading: false
    });
    console.log(this.state)
  }

  getGroupInfos = () => {
    groupServices.getGroupInfos(this.groupId, this.updateGroupInfos)
  }

  updateDataProfile = (dataProfile) => {
    this.setState({ idImageProfile: dataProfile.idImage })
  }

  getDataProfile = () => {
    accountServices.dataProfile(this.updateDataProfile, "")
  }

  updateGroupTasks = (data) => {
    this.setState({ groupTasks: data, isLoading: false})
  }

  getGroupTasks() {
    groupServices.getGroupTasks(this.groupId, this.updateGroupTasks)
  }

  callbackFunctionTaskName = (childData) => {
    this.setState({ taskName: childData })
  }

  callbackFunctionTaskDescription = (childData) => {
    this.setState({ taskDescription: childData })
  }

  callbackFunctionDateTimeStart = (childData) => {
    this.setState({ datetimeStart: childData })
  }

  callbackFunctionDateTimeEnd = (childData) => {
    this.setState({ datetimeEnd: childData })
  }

  updateDuration = (value) => {
    if (value)
      this.setState({ taskDuration: value })
  }

  updatePriority = (value) => {
    this.selectedPriority = value
    var priorityLevel = 1
    if (value == "Moyenne") {
      priorityLevel = 2
    } else if (value == "Haute") {
      priorityLevel = 3
    }
    this.setState({ taskPrioriy: priorityLevel })
  }

  displayPossibleDependencies = () => {
    if (this.state.groupTasks.length) {
      return (
        <View>
          <Text style={styles.container_title}> Tâches précédentes : </Text>
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            enableOnAndroid={true}
            contentContainerStyle={styles.taskUser_container}
          >
            <View>
              <FlatList
                data={this.state.groupTasks}
                keyExtractor={(item) => item.taskId.toString()}
                renderItem={({ item }) => this.renderTaskItem(item)}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      )
    }
  }

  renderMemberItem = (member) => {
    var selected = this.userSelection.get(member)
    if (selected) {
      return (
        <TouchableOpacity style={styles.user_container}
          onPress={() => {
            this.userSelection.set(member, false)
            this.setState({ taskUser: "" })
          }}>
          <View style={styles.leftAligned_container}>
            <Text style={styles.username_text}>{member}</Text>
          </View>
          <View style={styles.checkedImage_container}>
            <Image style={styles.checkedImage} source={require('../../assets/Images/checked.png')} />
          </View>
        </TouchableOpacity>
      );
    }
    else {
      return (
        <TouchableOpacity style={styles.user_container} onPress={() => {
          this.updateMemberSelection(member)
          this.setState({ taskUser: member })
        }}>
          <View style={styles.leftAligned_container}>
            <Text style={styles.username_text}>{member}</Text>
          </View>
          <View style={styles.checkedImage_container}>
          </View>
        </TouchableOpacity>
      );
    }
  }

  renderTaskItem = (task) => {
    var selected = this.taskSelection.get(task.taskId)
    if (selected) {
      return (
        <TouchableOpacity style={styles.task_container}
          onPress={() => {
            this.removeTaskDependency(task)
          }}>
          <View style={styles.leftAligned_container}>
            <TaskItem task={task} />
          </View>
          <View style={styles.checkedImage_container}>
            <Image style={styles.checkedImage} source={require('../../assets/Images/checked.png')} />
          </View>
        </TouchableOpacity>
      );
    }
    else {
      return (
        <TouchableOpacity style={styles.task_container}
          onPress={() => {
            this.addTaskDependency(task)
          }}>
          <View style={styles.leftAligned_container}>
            <TaskItem task={task} />
          </View>
          <View style={styles.checkedImage_container}>
          </View>
        </TouchableOpacity>
      );
    }
  }


  updateMemberSelection = (member) => {
    this.userSelection.set(member, true)
    for (let i = 0; i < this.state.groupMembers.length; i++) {
      if (this.state.groupMembers[i] != member)
        this.userSelection.set(this.state.groupMembers[i], false)
    }
  }

  addTaskDependency = (task) => {
    this.taskSelection.set(task.taskId, true)
    var newDependencies = this.state.taskDependencies
    newDependencies.push(task.taskId)
    this.setState({
      taskDependencies: newDependencies
    })
  }

  removeTaskDependency = (task) => {
    this.taskSelection.set(task.taskId, false)
    var newDependencies = this.state.taskDependencies
    for (let i = 0; i < newDependencies.length; i++) {
      if (newDependencies[i] == task.taskId.toString()) {
        newDependencies.splice(i, 1)
      }
    }
    this.setState({ taskDependencies: newDependencies })
  }

  redirect = () => {
    this.setState({isLoading: true})
    this.props.navigation.navigate("GroupTasks", {idGroup: this.groupId})
  }

  createTask = () => {
    var isValid = true
    if (this.state.taskName == "") {
      isValid = false
      alert("Veuillez renseigner un nom pour la tâche")
    }
    else if ((this.state.taskDuration == "" && !(this.state.datetimeStart != "" && this.state.datetimeEnd != ""))) {
      isValid = false,
        alert("Il n'y a pas assez d'informations pour estimer la durée de la tâche. \n" +
          "Veuillez renseigner soit : \n 1. le début et la fin de la tâche \n 2. le début et la durée \n 3.le début, la fin, et la durée. \n 4.la durée")
    }
    else if (!(generalServices.checkPrecedence(this.state.datetimeStart, this.state.datetimeEnd))) {
      isValid = false
      alert("Les dates de début et de fin sont invalides.")
    }

    if (isValid) {
      this.setState({isLoading: true}) 
      groupServices.createTask(this.groupId, this.taskName, this.taskDescription, this.datetimeStart, this.datetimeEnd,
        this.taskDuration, this.taskDependencies, this.taskUser, this.taskPrioriy, this.redirect)
    }
  }

  render() {
    return (
      <View style={styles.main_container}>
        <ProfileIcon idImage={this.state.idImageProfile} />
        <KeyboardAwareScrollView
          scrollEnabled={true}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid={true}
          keyboardOpeningTime={0}
          contentContainerStyle={styles.content_container}
        >
          <NameWithInput name='Nom de la tâche : ' type='none' placeholder={"Nom"} height={40}
            secureTextEntry={false} parentCallback={this.callbackFunctionTaskName} />
          <View style={styles.groupLined_container}>
            <Text style={styles.text}> Groupe : </Text>
            <Image style={styles.groupPic} source={ImagesGroup[this.state.idImageGroup]} />
            <Text style={styles.name_text}>{this.state.groupName}</Text>
          </View>
          <NameWithInput name='Description : ' type='none' placeholder={"Description"} height={60}
            secureTextEntry={false} parentCallback={this.callbackFunctionTaskDescription} />
          <Text style={styles.container_title}> Personne en charge : </Text>
          <View style={styles.taskUser_container}>
            <FlatList
              data={this.state.groupMembers}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => this.renderMemberItem(item)}
            />
          </View>
          <View style={styles.groupLined_container}>
            <View style={styles.centered_container}>
              <Text style={styles.text}> Début : </Text>
            </View>
            <View style={styles.rightAligned_container}>
              <DateTimePicker mode='datetime' name="00/00/0000 à 00:00" parentCallback={this.callbackFunctionDateTimeStart} />
            </View>
          </View>
          <View style={styles.groupLined_container}>
            <View style={styles.centered_container}>
              <Text style={styles.text}> Fin : </Text>
            </View>
            <View style={styles.rightAligned_container}>
              <DateTimePicker mode='datetime' name="00/00/0000 à 00:00" parentCallback={this.callbackFunctionDateTimeEnd} />
            </View>
          </View>
          <View style={styles.groupLined_container}>
            <View style={styles.leftAligned_container}>
              <View style={styles.leftAligned_container}>
                <Text style={styles.text}>Durée : </Text>
              </View>
              <View style={styles.rightAligned_container}>
                <TextInput
                  placeholder="en minutes"
                  style={styles.textInput}
                  keyboardType='numeric'
                  onChangeText={(text) => this.updateDuration(text)}
                  value={this.state.taskDuration}
                />
              </View>
            </View>
            <View style={styles.rightAligned_container}>
              <View style={styles.leftAligned_container}>
                <Text style={styles.text}> Priorité : </Text>
              </View>
              <View style={styles.rightAligned_container}>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={this.selectedPriority}
                  onValueChange={(itemValue, itemIndex) => this.updatePriority(itemValue)}
                >
                  <Picker.Item label="Basse" value="Basse" />
                  <Picker.Item label="Moyenne" value="Moyenne" />
                  <Picker.Item label="Haute" value="Haute" />
                </Picker>
              </View>
            </View>
          </View>
          {this.displayPossibleDependencies()}
          <View style={{ marginBottom: 100 }}>
            <CustomButton name='Créer' width={100} onPress={this.createTask}>
            </CustomButton>
          </View>
        </KeyboardAwareScrollView>
        {this.displayLoading()}
      </View >




    )
  }

}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#78e1db',
    flex: 1
  },
  content_container: {
    marginTop: 70,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  groupLined_container: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskUser_container: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'column',
    borderColor: '#ffdb58',
    borderWidth: 2,
    borderRadius: 15,
    alignItems: 'stretch',
    justifyContent: 'space-around'
  },
  user_container: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    margin: 5,
    borderColor: 'white',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 40,
  },
  task_container: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    margin: 5,
    borderColor: 'white',
    borderBottomWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  leftAligned_container: {
    flex: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  centered_container: {
    flex: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightAligned_container: {
    flex: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  checkedImage_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  groupPic: {
    resizeMode: 'contain',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderColor: '#ffb4e2',
    borderWidth: 3,
    borderRadius: 60,
    margin: 10
  },
  checkedImage: {
    alignItems: "flex-end",
    height: 20,
    width: 20,
    margin: 5
  },
  name_text: {
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    flexWrap: 'wrap',
    marginLeft: 20
  },
  username_text: {
    fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    flexWrap: 'wrap',
  },
  container_title: {
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight: 'bold',
    fontSize: 20,
    textDecorationLine: 'underline',
    textAlign: 'center',
    color: 'black',
    marginTop: 20,
    marginBottom: 10
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    marginRight: 10
  },
  textInput: {
    backgroundColor: 'white',
    textAlign: 'center',
    height: 30,
    width: 80,
    borderRadius: 10,
    marginRight: 10
  },
  picker: {
    width: 100,
  },
  pickerItem: {
    borderRadius: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Optima' : 'Roboto',
    fontSize: 20
  }
})




