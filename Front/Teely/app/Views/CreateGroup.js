// app/Views/CreateGroup.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, TextInput } from 'react-native'
import ActionButton from 'react-native-action-button'

import InputWithName from '../Components/InputWithName'
import Images from '../modules/ImageProfile'
import CustomButton from '../Components/CustomButton'
import groupServices from '../Services/GroupServices'

export default class CreateGroup extends React.Component {
  constructor(props) {
    super(props)
    this.groupName = ""
    this.description = ""
    this.state = {
      invitations: [],
      invitationInput: ""
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
          <FlatList data={this.state.invitations}
            renderItem={({ item }) =>
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.username} </Text>
              </View>
            }>
          </FlatList>
          <TextInput
            style={styles.textInput}
            onChangeText={text => this.setState({invitationInput: text})}
            value={this.state.invitationInput} placeholder={'Participant à inviter'}
          />
          <View style={styles.addButton}>
          <ActionButton
            buttonColor="pink"
            onPress={() => {
              this.state.invitations.push({ id: '5', username: this.state.invitationInput })
              this.setState({
                refresh: !this.state.refresh
              })
              this.setState({invitationInput: ''})
              console.log(this.state.invitations)
            }}
            position="center"
          />
          </View>
          <View style={styles.create_container}>
            <CustomButton name='Créer groupe' onPress={() => { 
              console.log(this.groupName)
              console.log(this.description)
              console.log(this.state)
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
    marginBottom: 10
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
      textAlign : 'center',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 10,
      marginVertical: 8
    },
  addButton: {
    marginBottom: 70,
    marginTop: -25
  }

});