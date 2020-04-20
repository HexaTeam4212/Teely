// app/Views/SignUp.js
import React from 'react'
import DateTimePicker from '../Components/DateTimePicker'
import InputWithName from '../Components/InputWithName'
import SubmitButton from '../Components/SubmitButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, Text, View, Image} from 'react-native'
import accountServices from '../Services/AccountServices';
export default class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.username=""
    this.password=""
    this.confirmedPassword=""
    this.email = ""
    this.lastName=""
    this.name=""
    this.birthDate=""
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
 


  render() {
    return(
    <View style={styles.main_container}>
      <KeyboardAwareScrollView 
        contentContainerstyle={styles.content_container} 
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        enableAutomaticScroll={(Platform.OS === 'ios')}
        enableOnAndroid={true}>
        <Image style={styles.logo} source={require('../../assets/logo.png')}/>
        <InputWithName name = "Nom d'utilisateur" type = 'username' placeholder='Pseudonyme' 
          secureTextEntry={false} parentCallback = {this.callbackFunctionUsername}/>
        <InputWithName name = 'Mot de passe' type = 'password' placeholder='********' 
          secureTextEntry={true} parentCallback = {this.callbackFunctionPassword}/>
        <InputWithName name = 'Confirmez votre mot de passe' type = 'password' placeholder='********' 
          secureTextEntry={true} parentCallback = {this.callbackFunctionConfirmedPassword}/>
        <InputWithName name = 'Adresse e-mail' type = 'emailAddress' placeholder='xyz@gmail.com' 
          secureTextEntry={false} parentCallback = {this.callbackFunctionEmail}/>
        <InputWithName name = 'Nom' type = 'none' placeholder='Nom' 
          secureTextEntry={false} parentCallback = {this.callbackFunctionLastName}/>
        <InputWithName name = 'Prénom' type = 'none' placeholder='Prénom' 
          secureTextEntry={false} parentCallback = {this.callbackFunctionName}/>
        <Text style = {styles.text}> Date de naissance </Text>
        <DateTimePicker name="aaaa-mm-jj" parentCallback = {this.callbackFunctionBirthDate}/>

        <SubmitButton name = 'Créer mon compte' 
          onPress = {() => accountServices.signup(this.username, this.password, this.confirmedPassword,
            this.email, this.lastName, this.name, this.birthDate)}/>
      </KeyboardAwareScrollView>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container : {
    backgroundColor: '#78e1db',
    flex: 1 
  },
  content_container : {
    flex:1,
    marginTop : 30,
    marginBottom : 10,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems: 'center'    
  },
  text: {
    marginTop : 10,
    fontFamily: 'Cochin',
    fontSize: 16,
    textAlign : 'center',
    color: 'black',  
    borderBottomWidth : 5
  },
  logo : {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 100,
    height: 100,
    borderColor: '#ffb4e2',
    borderWidth : 3,
    borderRadius: 50,
    borderBottomWidth : 20
  }
  
});