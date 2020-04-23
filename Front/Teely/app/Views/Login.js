// app/Views/Login.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Button } from 'react-native'

import SubmitButton from '../Components/SubmitButton'
import InputWithName from '../Components/InputWithName'
import accountServices from '../Services/AccountServices';

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false };
    this.username = ""
    this.password = ""
  }

  callbackFunctionUsername = (childData) => {
    this.username = childData
  }

  callbackFunctionPassword = (childData) => {
    this.password = childData
  }

  login = () => {
    accountServices.login(this.username, this.password, (connexionOK) => {
      if (connexionOK == true) {
        this.props.navigation.navigate("Profile")
      }
    })
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
          <SubmitButton name='Se connecter' onPress={this.login} />
          <Text style={styles.text}> Pas encore de compte ? </Text>
          <Button title='Inscription' onPress={() => {
            this.props.navigation.navigate("SignUp")
          }} />
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
  content_container: {
    flex: 1,
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

});