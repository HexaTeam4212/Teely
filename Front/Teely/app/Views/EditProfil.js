// app/Views/EditProfil.js
import React from 'react';
import NameWithInput from '../Components/NameWithInput'
import DateTimePicker from '../Components/DateTimePicker'
import { StyleSheet, View, Image, TouchableOpacity, Text, Platform, ActivityIndicator } from 'react-native';
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import accountServices from '../Services/AccountServices';

export default class EditProfil extends React.Component {
  constructor(props) {
    super(props)
    this.birthDate = ""
    this.firstLoadPage = true
    this.initDatasProfil = []
    this.state = { isLoading: false, 
                username : "",
                password : "",
                confirmedPassword : "",
                email : "",
                lastName : "",
                name : "",
                biography : "" }
  }

  displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  callbackFunctionUsername = (childData) => {
    this.setState({username:childData})
  }

  callbackFunctionPassword = (childData) => {
    this.setState({password:childData})
  }

  callbackFunctionConfirmedPassword = (childData) => {
    this.setState({confirmedPassword:childData})
  }

  callbackFunctionEmail = (childData) => {
    this.setState({email:childData})
  }

  callbackFunctionLastName = (childData) => {
    this.setState({ lastName: childData })
  }

  callbackFunctionName = (childData) => {
    this.setState({name:childData})
  }

  callbackFunctionBirthDate = (childData) => {
    this.birthDate = childData
  }

  callbackFunctionBibliography = (childData) => {
    this.setState({biography:childData})
  }

  redirect = (profilOk) => {
    this.setState({isLoading:false})
    if (profilOk) {
      this.props.navigation.navigate("Profile")//mettre le nom de la bonne page quand cree
    }
    
  }

  saveProfil = () => {
    this.setState({isLoading:true})
    accountServices.saveProfil(this.state.username, this.state.password, this.state.confirmedPassword,
      this.state.email, this.state.lastName, this.state.name, this.birthDate, this.state.biography, this.redirect)
  }

  dataProfil = () => {
    if (this.firstLoadPage) {
      console.log("firstloadPage")
      this.initDatasProfil = accountServices.dataProfil()
      console.log(this.initDatasProfil)
      this.birthDate = this.initDatasProfil[5]
      this.setState({lastName : this.initDatasProfil[0], name : this.initDatasProfil[1], 
      username : this.initDatasProfil[2],password: this.initDatasProfil[3], 
      confirmedPassword:this.initDatasProfil[3], email: this.initDatasProfil[4],
      biography: this.initDatasProfil[6]})
      this.firstLoadPage = false

    }

    return (
      <KeyboardAwareScrollView
        contentContainerstyle={styles.content_container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        enableAutomaticScroll={(Platform.OS === 'ios')}
        enableOnAndroid={true}>
        <NameWithInput name='Nom : ' type='none' placeholder={this.initDatasProfil[0]} height={40}
          value={this.state.lastName} secureTextEntry={false} parentCallback={this.callbackFunctionLastName} />
        <NameWithInput name='Prénom : ' type='none' placeholder={this.initDatasProfil[1]} height={40}
          value={this.state.name} secureTextEntry={false} parentCallback={this.callbackFunctionName} />
        <NameWithInput name="Nom d'utilisateur : " type='username' placeholder={this.initDatasProfil[2]} height={40}
          value={this.state.username} secureTextEntry={false} parentCallback={this.callbackFunctionUsername} />
        <NameWithInput name='Mot de passe : ' type='password' placeholder={this.initDatasProfil[3]} height={40}
          value={this.state.password} secureTextEntry={true} parentCallback={this.callbackFunctionPassword} />
        <NameWithInput name={"Confirmez votre \nmot de passe : "} type='password' placeholder={this.initDatasProfil[3]} height={40}
          value={this.state.confirmedPassword} secureTextEntry={true} parentCallback={this.callbackFunctionName} />
        <NameWithInput name='Email : ' type='emailAddress' placeholder={this.initDatasProfil[4]} height={40}
          value={this.state.email} secureTextEntry={false} parentCallback={this.callbackFunctionEmail} />
        <View style={styles.date_container} >
          <Text style={[styles.text, { marginLeft: 15 }]}> Date de naissance : </Text>
          <DateTimePicker name={this.initDatasProfil[5]} marginRight={22} parentCallback={this.callbackFunctionBirthDate} />
        </View>
        <NameWithInput name='Biographie : ' type='none' placeholder={this.initDatasProfil[6]} height={200}
          value={this.state.biography} secureTextEntry={false} parentCallback={this.callbackFunctionBibliography} />
      </KeyboardAwareScrollView>
    )
  }

  render() {
    return (
      <View style={styles.main_container}>
          <View style={styles.image_container}>
            <Image style={styles.logo} source={require('../../assets/Images/logo.png')} />
            <TouchableOpacity style={styles.button} onPress={() => this.afficher()}>
              <Text style={styles.buttonText}>modifier</Text>
            </TouchableOpacity>
          </View>
        <View style={styles.content_container}>
          {this.dataProfil()}
        </View>
        <View style={styles.buttons_container}>
          <CustomButton name="Enregistrer" onPress={this.saveProfil} />
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
    flex: 7,
    marginTop: 10,
  },
  image_container: {
    flex: 2,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttons_container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20

  },
  date_container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'center'
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
  buttonText: {
    fontSize: 14,
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  button: {
    padding: 5,
    backgroundColor: 'transparent',
    height: 30,
    width: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: "center",
  },
  logo: {
    resizeMode: 'contain',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderColor: '#ffb4e2',
    borderWidth: 3,
    borderRadius: 50,
    marginBottom: 20
  },
  goBack: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    marginLeft: 10,
    marginTop: 10
  },
  text: {
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginBottom: 5
  }

});