// app/Views/EditProfil.js
import React from 'react';
import NameWithInput from '../Components/NameWithInput'
import DateTimePicker from '../Components/DateTimePicker'
import { StyleSheet, View, Image, TouchableOpacity, Text, Platform, ActivityIndicator, ScrollView } from 'react-native';
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import accountServices from '../Services/AccountServices';
import Images from '../modules/ImageProfil';

export default class EditProfil extends React.Component {
  constructor(props) {
    super(props)
    this.birthDate = ""
    this.firstLoadPage = true
    this.initDatasProfil = []
    this.idImage = 18
    this.state = {
      isLoading: false,
      username: "",
      password: "",
      confirmedPassword: "",
      email: "",
      lastName: "",
      name: "",
      biography: "",
    }
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
    this.setState({ username: childData })
  }

  callbackFunctionPassword = (childData) => {
    this.setState({ password: childData })
  }

  callbackFunctionConfirmedPassword = (childData) => {
    this.setState({ confirmedPassword: childData })
  }

  callbackFunctionEmail = (childData) => {
    this.setState({ email: childData })
  }

  callbackFunctionLastName = (childData) => {
    this.setState({ lastName: childData })
  }

  callbackFunctionName = (childData) => {
    this.setState({ name: childData })
  }

  callbackFunctionBirthDate = (childData) => {
    this.birthDate = childData
  }

  callbackFunctionBibliography = (childData) => {
    this.setState({ biography: childData })
  }

  redirect = (profilOk) => {
    this.setState({ isLoading: false })
    if (profilOk) {
      this.props.navigation.navigate("Profile")
    }

  }

  saveProfil = () => {
    if (this.username == '' || this.password == '' || this.confirmedPassword == '' || this.birthDate == ''
      || this.lastName == '' || this.name == '' || this.email == '') {
      alert("Veuillez remplir tous les champs !")
    }
    else if (this.password != this.confirmedPassword) {
      alert("Les mots de passe saisis ne sont pas identiques, merci de re-vérifier")
    }
    else {
      this.setState({ isLoading: true })
      accountServices.saveProfil(this.state.username, this.state.password, this.state.confirmedPassword,
        this.state.email, this.state.lastName, this.state.name, this.birthDate, this.state.biography,
        this.redirect)
    }

  }

  getDataProfil = () => {
    if (this.firstLoadPage) {
      console.log("firstloadPage")
      this.initDatasProfil = accountServices.dataProfil()
      console.log(this.initDatasProfil)
      this.birthDate = this.initDatasProfil[5]
      this.idImage = this.initDatasProfil[7]
      this.setState({
        lastName: this.initDatasProfil[0], name: this.initDatasProfil[1],
        username: this.initDatasProfil[2], password: this.initDatasProfil[3],
        confirmedPassword: this.initDatasProfil[3], email: this.initDatasProfil[4],
        biography: this.initDatasProfil[6]
      })
      this.firstLoadPage = false

    }
  }

  imageProfil = () => {
    this.getDataProfil()
    console.log(this.initDatasProfil)
    return (
      <Image style={styles.profil} source={Images[this.idImage]} />
    )
  }

  render() {
    return (
      <View style={styles.main_container}>

        <View style={styles.content_container}>
          <KeyboardAwareScrollView
            contentContainerstyle={styles.content_container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            enableOnAndroid={true}
          >
            <View style={styles.image_container}>
              {this.imageProfil()}
            </View>
            <NameWithInput name='Nom : ' type='none' placeholder={this.initDatasProfil[0]} height={40}
              value={this.state.lastName} secureTextEntry={false} parentCallback={this.callbackFunctionLastName} />
            <NameWithInput name='Prénom : ' type='none' placeholder={this.initDatasProfil[1]} height={40}
              value={this.state.name} secureTextEntry={false} parentCallback={this.callbackFunctionName} />
            <NameWithInput name={"Nom \nd'utilisateur : "} type='username' placeholder={this.initDatasProfil[2]} height={40}
              value={this.state.username} secureTextEntry={false} parentCallback={this.callbackFunctionUsername} />
            <NameWithInput name='Mot de passe : ' type='password' placeholder={this.initDatasProfil[3]} height={40}
              value={this.state.password} secureTextEntry={true} parentCallback={this.callbackFunctionPassword} />
            <NameWithInput name={"Confirmez votre \nmot de passe : "} type='password' placeholder={this.initDatasProfil[3]} height={40}
              value={this.state.confirmedPassword} secureTextEntry={true} parentCallback={this.callbackFunctionName} />
            <NameWithInput name='Email : ' type='emailAddress' placeholder={this.initDatasProfil[4]} height={40}
              value={this.state.email} secureTextEntry={false} parentCallback={this.callbackFunctionEmail} />
            <View style={styles.date_container} >
              <Text style={[styles.text, { marginLeft: 40, marginRight : 15 }]}>Date de {'\n'}naissance :</Text>
              <DateTimePicker name={this.initDatasProfil[5]} marginRight={35} parentCallback={this.callbackFunctionBirthDate} />
            </View>
            <NameWithInput name='Biographie : ' type='none' placeholder={this.initDatasProfil[6]} height={200}
              value={this.state.biography} secureTextEntry={false} parentCallback={this.callbackFunctionBibliography} />
            <View style={styles.buttons_container}>
              <CustomButton name="Enregistrer" onPress={this.saveProfil} />
            </View>
          </KeyboardAwareScrollView>
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
    margin: 5,
    // borderColor: '#ffdb58',
    // borderRadius: 10,
    // borderWidth: 5,
  },
  image_container: {
    flex: 2,
    marginTop: 10,
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
  profil: {
    resizeMode: 'contain',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderColor: '#ffb4e2',
    borderWidth: 3,
    borderRadius: 60,
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