// app/Views/EditProfil.js
import React from 'react';
import NameWithInput from '../Components/NameWithInput'
import DateTimePicker from '../Components/DateTimePicker'
import { StyleSheet, View, Image, TouchableOpacity, Text, Platform, ActivityIndicator } from 'react-native';
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import accountServices from '../Services/AccountServices';
import Images from '../modules/ImageProfile';

export default class EditProfil extends React.Component {
  constructor(props) {
    super(props)
    this.birthDate = ""
    this.firstLoadPage = true
    this.initDataProfile = []
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
      this.props.navigation.navigate("Profile")//mettre le nom de la bonne page quand cree
    }

  }

  saveProfile = () => {
    if (this.username == '' || this.password == '' || this.confirmedPassword == '' || this.birthDate == ''
      || this.lastName == '' || this.name == '' || this.email == '') {
      alert("Veuillez remplir tous les champs !")
    }
    else if (this.password != this.confirmedPassword) {
      alert("Les mots de passe saisis ne sont pas identiques, merci de re-vérifier")
    }
    else {
      this.setState({ isLoading: true })
      accountServices.saveProfile(this.state.username, this.state.password, this.state.confirmedPassword,
        this.state.email, this.state.lastName, this.state.name, this.birthDate, this.state.biography,
        this.redirect)
    }

  }

  getDataProfile = () => {
    if (this.firstLoadPage) {
      console.log("firstloadPage")
      this.initDataProfile = accountServices.dataProfile()
      console.log(this.initDataProfile)
      this.birthDate = this.initDataProfile[5]
      this.idImage = this.initDataProfile[7]
      this.setState({
        lastName: this.initDataProfile[0], name: this.initDataProfile[1],
        username: this.initDataProfile[2], password: this.initDataProfile[3],
        confirmedPassword: this.initDataProfile[3], email: this.initDataProfile[4],
        biography: this.initDataProfile[6]
      })
      this.firstLoadPage = false

    }
  }

  imageProfil = () => {
    this.getDataProfile()
    console.log(this.initDataProfile)
    return (
      <Image style={styles.profil} source={Images[this.idImage]} />
    )
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.image_container}>
          {this.imageProfil()}
        </View>
        <View style={styles.content_container}>

        <KeyboardAwareScrollView
        contentContainerstyle={styles.content_container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        enableAutomaticScroll={(Platform.OS === 'ios')}
        enableOnAndroid={true}>
        <NameWithInput name='Nom : ' type='none' placeholder={this.initDataProfile[0]} height={40}
          value={this.state.lastName} secureTextEntry={false} parentCallback={this.callbackFunctionLastName} />
        <NameWithInput name='Prénom : ' type='none' placeholder={this.initDataProfile[1]} height={40}
          value={this.state.name} secureTextEntry={false} parentCallback={this.callbackFunctionName} />
        <NameWithInput name="Nom d'utilisateur : " type='username' placeholder={this.initDataProfile[2]} height={40}
          value={this.state.username} secureTextEntry={false} parentCallback={this.callbackFunctionUsername} />
        <NameWithInput name='Mot de passe : ' type='password' placeholder={this.initDataProfile[3]} height={40}
          value={this.state.password} secureTextEntry={true} parentCallback={this.callbackFunctionPassword} />
        <NameWithInput name={"Confirmez votre \nmot de passe : "} type='password' placeholder={this.initDataProfile[3]} height={40}
          value={this.state.confirmedPassword} secureTextEntry={true} parentCallback={this.callbackFunctionName} />
        <NameWithInput name='Email : ' type='emailAddress' placeholder={this.initDataProfile[4]} height={40}
          value={this.state.email} secureTextEntry={false} parentCallback={this.callbackFunctionEmail} />
        <View style={styles.date_container} >
          <Text style={[styles.text, { marginRight: 10 }]}>Date de naissance : </Text>
          <DateTimePicker name={this.initDataProfile[5]} marginRight={35} parentCallback={this.callbackFunctionBirthDate} />
        </View>
        <NameWithInput name='Biographie : ' type='none' placeholder={this.initDataProfile[6]} height={200} multiline={true}
          value={this.state.biography} secureTextEntry={false} parentCallback={this.callbackFunctionBibliography} />
      </KeyboardAwareScrollView>
        </View>
        <View style={styles.buttons_container}>
          <CustomButton name="Enregistrer" onPress={this.saveProfile} />
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
    borderColor: '#ffdb58',
    borderWidth: 2,
    borderRadius: 10,
    margin: 7,
    backgroundColor: '#60dbd3',
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