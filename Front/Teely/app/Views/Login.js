// app/Views/Login.js
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'

import CustomButton from '../Components/CustomButton'
import InputWithName from '../Components/InputWithName'
import accountServices from '../Services/AccountServices';

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false };
    this.username = ""
    this.password = ""
    this.state = { isLoading: false }
  }

  callbackFunctionUsername = (childData) => {
    this.username = childData
  }

  callbackFunctionPassword = (childData) => {
    this.password = childData
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

  login = () => {
    this.setState({isLoading:true})
    if (this.username.length > 0 && this.password.length > 0) {
      accountServices.login(this.username, this.password, (connexionOK) => {
        if (connexionOK == true) {
          this.props.navigation.navigate("Profile")
        }
        this.setState({isLoading:false})
      })
    }
    else {
      alert("Veuillez renseigner votre nom d'utilisateur et mot de passe")
    }
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

          <Image style={styles.logo} source={require('../../assets/Images/logo.png')} />
          <InputWithName name="Nom d'utilisateur" type='username' placeholder='Pseudonyme'
            secureTextEntry={false} parentCallback={this.callbackFunctionUsername} />
          <InputWithName name='Mot de passe' type='password' placeholder='********'
            secureTextEntry={true} parentCallback={this.callbackFunctionPassword} />
          <View style={styles.connexionButtonView}>
            <CustomButton name='Connexion' onPress={this.login} />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.inscriptionView}>
          <Text style={styles.inscriptionLabel}> Pas encore de compte ? </Text>
          <CustomButton name='Inscription' onPress={() => {
            this.props.navigation.navigate("SignUp")
          }} />
        </View>
        {this.displayLoading()}
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
  logo: {
    marginTop: 10,
    alignSelf: 'center',
    resizeMode: 'contain',
    flex: 1,
    height: 150,
    borderRadius: 50,
    marginBottom: 20
  },
  inscriptionView: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    right: 0
  },
  inscriptionLabel: {
    marginBottom: -15
  },
  connexionButtonView: {
    marginTop: 30
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