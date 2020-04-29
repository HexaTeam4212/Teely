// app/Views/CreateGroup.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, FlatList } from 'react-native'

import InputWithName from '../Components/InputWithName'
import Images from '../modules/ImageProfile'
import InviteButton from '../Components/InviteButton'
import CustomButton from '../Components/CustomButton'

export default class CreateGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groupName: false,
      description: "",
      invitations: [{ id: "1", username: "user1re" }, { id: "2", username: "user2" }]
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
          <InputWithName placeholder='Nom du groupe' value={this.state.groupName} parentCallback={this.callbackFunctionGroupName} />
          <InputWithName style={styles.text} placeholder={'Description\n\n\n'} value={this.state.description}
            parentCallback={this.callbackFunctionDescription} multiline={true} />
          <FlatList data={this.state.invitations}
            renderItem={({ item }) =>
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.username} </Text>
              </View>
            }>
          </FlatList>
          <InviteButton name='Inviter des participants' 
          onPress={() => {
            this.state.invitations.push({id:'5', username: 'root'})
            this.setState({ 
              refresh: !this.state.refresh
            })
            console.log(this.state.invitations)
          }}></InviteButton>
          <View style={styles.create_container}>
            <CustomButton name='Créer groupe'></CustomButton>
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
    marginTop: 30
  },
  item: {
    backgroundColor: 'lightpink',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 50,
  },
  itemText: {
    alignSelf: 'center'
  }

});