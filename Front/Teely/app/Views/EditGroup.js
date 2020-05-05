// app/Views/EditGroup.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {StyleSheet, View, ActivityIndicator } from 'react-native'

import ProfileIcon from '../Components/ProfileIcon'
import GroupIcon from '../Components/GroupIcon'
import NameWithInput from '../Components/NameWithInput'
import CustomButton from '../Components/CustomButton'
import groupServices from '../Services/GroupServices'
import { backgroundGradientColor } from '../modules/BackgroundGradientColor'

export default class EditGroup extends React.Component {
  constructor(props) {
    super(props)
    let params = this.props.route.params
    this.groupId = params.idGroup
    this.state= {
      idImageGroup: params.idImageGroup,
      idImageProfile: params.idImageProfile,
      name: params.name,
      description: params.description,
      isLoading: false
    }
  }

  callbackFunctionGroupName = (childData) => {
    this.setState({name: childData})
  }

  callbackFunctionDescription = (childData) => {
    this.setState({description: childData})
  }

  redirect = (result) => {
    this.setState({isLoading: false})
    if (result) {
      this.props.navigation.navigate("DetailedGroup")
    } else {
      alert("Une erreur est survenue, merci de réessayer ultérieurement.")
    }
  }

  updateGroup = () => {
    this.setState({isLoading: true})
    if (this.state.name=="" || this.state.description=="") {
      alert("Veuillez remplir tous les champs !")
    } else {
      groupServices.updateGroupInfos(this.groupId, this.state.name, this.state.description, this.redirect)
    }
  }


  render() {
    return (
      <View style={styles.main_container}>
        {backgroundGradientColor()}
        <ProfileIcon idImage={this.state.idImageProfile} />
        <GroupIcon idImage={this.state.idImageGroup} />
          <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            enableOnAndroid={true}
            contentContainerStyle={styles.content_container}>
            <NameWithInput name='Nom du groupe : ' type='none' placeholder={"Nom"} height={40}
              value={this.state.name} secureTextEntry={false} parentCallback={this.callbackFunctionGroupName} />
            <NameWithInput name='Description : ' type='none' placeholder={"Description"} height={150} multiline={true}
              value={this.state.description} secureTextEntry={false} parentCallback={this.callbackFunctionDescription} />

            <CustomButton name='Modifier' width={200} onPress= {this.updateGroup}></CustomButton>
          </KeyboardAwareScrollView>
        </View>
      
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
    alignItems: 'stretch'
  },
  head_container: {
    flex: 2,
    marginRight: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  }
});