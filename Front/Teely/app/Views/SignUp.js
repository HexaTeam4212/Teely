// app/Views/SignUp.js
import React from 'react'
import DateTimePicker from '../Components/DateTimePicker'
import InputWithName from '../Components/InputWithName'
import SubmitButton from '../Components/SubmitButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, ActivityIndicator, Platform} from 'react-native'

import accountServices from '../Services/AccountServices';
export default class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.username = ""
    this.password = ""
    this.confirmedPassword = ""
    this.email = ""
    this.lastName = ""
    this.name = ""
    this.birthDate = ""
    this.state = { isLoading: false }
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

  callbackFunctionUsername = (childData) => {
    this.username = childData
  }

  callbackFunctionPassword = (childData) => {
    this.password = childData
  }

  callbackFunctionConfirmedPassword = (childData) => {
    this.confirmedPassword = childData
  }

  callbackFunctionEmail = (childData) => {
    this.email = childData
  }

  callbackFunctionLastName = (childData) => {
    this.lastName = childData
  }


  callbackFunctionName = (childData) => {
    this.name = childData
  }

  callbackFunctionBirthDate = (childData) => {
    this.birthDate = childData
  }

  redirect = (signUpOK) => {
    this.setState({ isLoading: false })
    if (signUpOK == true) {
      this.props.navigation.navigate("Login")
    }

  }

  signup = () => {
    this.setState({ isLoading: true })
    accountServices.signup(this.username, this.password, this.confirmedPassword,
      this.email, this.lastName, this.name, this.birthDate, this.redirect)
  }



  render() {
    return (
      <View style={styles.main_container}>
        <KeyboardAwareScrollView
          contentContainerstyle={styles.content_container}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
          enableAutomaticScroll={(Platform.OS === 'ios')}
          enableOnAndroid={true}>

          <InputWithName name="Nom d'utilisateur" type='username' placeholder='Pseudonyme'
            secureTextEntry={false} parentCallback={this.callbackFunctionUsername} />
          <InputWithName name='Mot de passe' type='password' placeholder='********'
            secureTextEntry={true} parentCallback={this.callbackFunctionPassword} />
          <InputWithName name='Confirmez votre mot de passe' type='password' placeholder='********'
            secureTextEntry={true} parentCallback={this.callbackFunctionConfirmedPassword} />
          <InputWithName name='Adresse e-mail' type='emailAddress' placeholder='xyz@gmail.com'
            secureTextEntry={false} parentCallback={this.callbackFunctionEmail} />
          <InputWithName name='Nom' type='none' placeholder='Nom'
            secureTextEntry={false} parentCallback={this.callbackFunctionLastName} />
          <InputWithName name='Prénom' type='none' placeholder='Prénom'
            secureTextEntry={false} parentCallback={this.callbackFunctionName} />
          <Text style={styles.text}> Date de naissance </Text>
          <DateTimePicker name="aaaa-mm-jj" parentCallback={this.callbackFunctionBirthDate} />

          <SubmitButton name='Créer mon compte'
            onPress={this.signup} />
          {this.displayLoading()}
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
  head_container: {
    justifyContent:'flex-start'

  },
  content_container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    borderBottomWidth: 5
  },
  logo: {
    marginTop: 10,
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 75,
    height: 75,
    borderColor: '#ffb4e2',
    borderWidth: 3,
    borderRadius: 50,
    borderBottomWidth: 20
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