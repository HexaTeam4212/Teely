// app/Views/CreateGroup.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput } from 'react-native'
import ActionButton from 'react-native-action-button'
import Autocomplete from 'react-native-autocomplete-input'

import InputWithName from '../Components/InputWithName'
import Images from '../modules/ImageProfile'
import CustomButton from '../Components/CustomButton'
import groupServices from '../Services/GroupServices'
import accountServices from '../Services/AccountServices'

export default class CreateGroup extends React.Component {
  constructor(props) {
    super(props)
    this.groupName = ""
    this.description = ""
    this.state = {
      usernameInput: "",
      usernameList: [],
      invitedUsers: []
    }
  }

  callbackFunctionGroupName = (childData) => {
    this.groupName = childData
  }

  callbackFunctionDescription = (childData) => {
    this.description = childData
  }

  render() {
    return (
      <View style={styles.main_container}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid={true}>
          <Image style={styles.profile} source={Images[2]} />
          <InputWithName placeholder='Nom du groupe' value={this.groupName} parentCallback={this.callbackFunctionGroupName} />
          <InputWithName style={styles.text} placeholder={'Description\n\n\n'} value={this.description}
            parentCallback={this.callbackFunctionDescription} multiline={true} />
          <FlatList data={this.state.invitedUsers}
            renderItem={({ item }) =>
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.username} </Text>
              </View>
            }>
          </FlatList>
          {/* <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({ usernameInput: text })}
            value={this.state.usernameInput} placeholder={'Participant à inviter'}
          /> */}
          <Autocomplete
            inputContainerStyle={styles.textInput}
            listContainerStyle={styles.suggestionList}
            placeholder="Participant à inviter"
            data={this.state.usernameList}
            defaultValue={this.state.usernameInput}
            onChangeText={text => {
              this.setState({ usernameInput: text })
              accountServices.getAccountUsernames(text, (usernameResults) => {
                let newUsernameList = []
                for (let i = 0; i<usernameResults.length; i++) {
                  newUsernameList.push({id: i+1, username: usernameResults[i]})
                }
                this.setState({usernameList: newUsernameList})
              })
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() =>{
                 this.setState({ usernameInput: item.username })
                 this.setState({usernameList: []})
                 }}>
                <Text>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.addButton}>
            <ActionButton
              buttonColor="pink"
              onPress={() => {
                this.state.invitedUsers.push({ id: this.state.invitedUsers.length+1, username: this.state.usernameInput })
                this.setState({
                  refresh: !this.state.refresh
                })
                this.setState({ usernameInput: '' })
              }}
              position="center"
            />
          </View>
          <View style={styles.create_container}>
            <CustomButton name='Créer groupe' onPress={() => {
              groupServices.createGroup(this.groupName, this.description, this.state.invitations,
                () => this.props.navigation.navigate("Groups"))
            }}></CustomButton>
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#78e1db',
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
    alignSelf: 'center'
  },
  textInput: {
    backgroundColor: 'white',
    marginLeft: "15%",
    marginRight: "15%",
    marginTop: "5%",
    borderWidth: 0
  },
  suggestionList: {
    marginLeft: "15%",
    marginRight: "15%",
    borderWidth: 0
  },
  addButton: {
    marginBottom: 70,
    marginTop: -10
  }

});