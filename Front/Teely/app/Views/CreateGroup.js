// app/Views/CreateGroup.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput } from 'react-native'
import ActionButton from 'react-native-action-button'
import Autocomplete from 'react-native-autocomplete-input'

import InputWithName from '../Components/InputWithName'
import ImagesGroup from '../modules/ImageGroup'
import CustomButton from '../Components/CustomButton'
import groupServices from '../Services/GroupServices'
import accountServices from '../Services/AccountServices'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'

export default class CreateGroup extends React.Component {
  constructor(props) {
    super(props)
    this.groupName = ""
    this.description = ""
    this.idImageGroup = 18
    this.state = {
      usernameInput: "",
      usernameList: [],
      invitedUsers: []
    }
    this.isUsernameValid = true
  }

  callbackFunctionGroupName = (childData) => {
    this.groupName = childData
  }

  callbackFunctionDescription = (childData) => {
    this.description = childData
  }

  pickImageGroup = () => {
    let max = 5
    this.idImageGroup = Math.floor(Math.random() * max)
  }

  render() {
    return (
      <View style={styles.main_container}>
        {backgroundGradientColor()}
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid={true}>
          <Image style={styles.profile} source={ImagesGroup[18]} />
          <InputWithName placeholder='Nom du groupe' value={this.groupName} parentCallback={this.callbackFunctionGroupName} />
          <InputWithName placeholder={'Description\n\n\n'} value={this.description}
            parentCallback={this.callbackFunctionDescription} multiline={true} />
          <FlatList data={this.state.invitedUsers}
            renderItem={({ item }) =>
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.key} </Text>
                <TouchableOpacity style={styles.crossButton} onPress={() => {
                  const username = item.key
                  this.state.invitedUsers.splice(this.state.invitedUsers.findIndex(v => v.key === username), 1)
                  this.setState({ invitedUsers: this.state.invitedUsers })
                }}>
                  <Image style={{ height: 30, width: 30 }} source={require('../../assets/Images/cross.png')} />
                </TouchableOpacity>
              </View>
            }>
          </FlatList>
          <Autocomplete
            inputContainerStyle={styles.textInput}
            listContainerStyle={styles.suggestionList}
            placeholder="Participant à inviter"
            data={this.state.usernameList}
            defaultValue={this.state.usernameInput}
            onChangeText={text => {
              this.setState({ usernameInput: text })
              this.isUsernameValid = this.state.usernameList.some((item) => item.key === text)
              accountServices.getAccountUsernames(text, false, (usernameResults) => {
                let newUsernameList = []
                for (let i = 0; i < usernameResults.length; i++) {
                  newUsernameList.push({ key: usernameResults[i] })
                }
                this.setState({ usernameList: newUsernameList })
              })
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                this.setState({ usernameInput: item.key })
                this.setState({ usernameList: [] })
                this.isUsernameValid = true
              }}>
                <Text>{item.key}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.addButton}>
            <ActionButton
              buttonColor="pink"
              onPress={() => {
                if (this.state.invitedUsers.some(item => item.key === this.state.usernameInput)) {
                  alert("Cet utilisateur est déjà dans la liste des participants !")
                }
                else if (this.state.usernameList.some(item => item.key !== this.state.usernameInput) || !this.isUsernameValid || this.state.usernameInput.length === 0) {
                  alert("Cet utilisateur n'existe pas !")
                }
                else {
                  this.state.invitedUsers.push({ key: this.state.usernameInput })
                  this.setState({
                    refresh: !this.state.refresh
                  })
                  this.setState({ usernameInput: '' })
                }
              }}
              position="center"
            />
          </View>
          <View style={styles.create_container}>
            <CustomButton name='Créer groupe' width={200} onPress={() => {
              if (this.groupName.length === 0) {
                alert("Le groupe n'a pas de nom !")
              }
              else if (this.description.length === 0) {
                alert("Le champ description est vide !")
              }
              else {
                this.pickImageGroup()
                let invitedUsersArray = []
                for (let i = 0; i < this.state.invitedUsers.length; i++) {
                  invitedUsersArray.push(this.state.invitedUsers[i].key)
                }
                groupServices.createGroup(this.groupName, this.description, invitedUsersArray, this.idImageGroup,
                  () => this.props.navigation.navigate("Groups", { refresh: true }))

              }
            }}></CustomButton>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1
  },
  profile: {
    resizeMode: 'contain',
    alignItems: 'center',
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderColor: '#ffb4e2',
    borderWidth: 3,
    borderRadius: 60,
    margin: 10
  },
  create_container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
  },
  item: {
    backgroundColor: 'lightpink',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 50,
  },
  itemText: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: 'white',
    marginLeft: "15%",
    marginRight: "15%",
    marginTop: "5%",
    borderWidth: 0,
  },
  suggestionList: {
    marginLeft: "15%",
    marginRight: "15%",
    borderWidth: 0
  },
  addButton: {
    marginBottom: 70,
    marginTop: -10
  },
  crossButton: {
      alignSelf: 'flex-end',
      marginRight: -55,
      marginTop: -26
  }

});