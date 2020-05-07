// app/Views/EditProfil.js
import React from 'react';
import NameWithInput from '../Components/NameWithInput'
import DateTimePicker from '../Components/DateTimePicker'
import { StyleSheet, View, Image, TouchableOpacity, Text, Platform, ActivityIndicator } from 'react-native';
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import accountServices from '../Services/AccountServices';
import Images from '../modules/ImageProfile';
import moment from 'moment'

export default class EditProfil extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      username: "",
      current_password: "",
      new_password: "",
      confirmedPassword: "",
      email: "",
      lastName: "",
      name: "",
      biography: "",
      birthDate: "jj-mm-aaaa",
      idImage: ""
    }

    this.getDataProfile()
  }

  displayLoading() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' color='#ffb4e2'/>
        </View>
      )
    }
  }

  callbackFunctionUsername = (childData) => {
    this.setState({ username: childData })
  }

  callbackFunctionCurrentPassword = (childData) => {
    this.setState({ current_password: childData })
  }

  callbackFunctionNewPassword = (childData) => {
    this.setState({ new_password: childData })
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
    this.setState({ birthDate: childData })
  }

  callbackFunctionBibliography = (childData) => {
    this.setState({ biography: childData })
  }

  redirect = (profileOk) => {
    this.setState({ isLoading: false })
    if (profileOk) {
      this.props.navigation.navigate("Profile")
    }

  }

  saveProfile = () => {
    if (this.state.current_password == '') {
      alert("Veuillez rentrer votre mot de passe !")
    }
    else if (this.state.new_password != '' || this.state.confirmedPassword != '') {
      if (this.state.new_password != this.state.confirmedPassword) {
        alert("Les mots de passe saisis ne sont pas identiques, merci de re-vérifier")
      }
    }
    else {
      this.setState({ isLoading: true })
      accountServices.saveProfile(this.state.username, this.state.current_password, this.state.new_password,
        this.state.email, this.state.lastName, this.state.name, this.state.birthDate, this.state.biography,
        this.redirect)
    }

  }

  updateDataProfile = (dataProfile) => {
    this.setState({
      username: dataProfile.username, name: dataProfile.name, lastName: dataProfile.lastName,
      birthDate: this.formatDate(dataProfile.birthDate), biography: dataProfile.bio, idImage: dataProfile.idImage,
      email: dataProfile.email,
      idImage: dataProfile.idImage, isLoading: false
    })
  }

  getDataProfile = () => {
    accountServices.dataProfile(this.updateDataProfile, "")
  }

  imageProfile = () => {
    return (
      <Image style={styles.profil} source={Images[this.state.idImage]} />
    )
  }

  formatDate(dateString) {
    var date = new Date(dateString);
    var formattedDate = moment(date).format("YYYY-MM-DD")
    return formattedDate
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.image_container}>
          {this.imageProfile()}
        </View>
        <View style={styles.content_container}>

          <KeyboardAwareScrollView
            contentContainerstyle={styles.content_container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            enableOnAndroid={true}>
            <NameWithInput name='Nom : ' type='none' placeholder={"Nom"} height={40}
              value={this.state.lastName} secureTextEntry={false} parentCallback={this.callbackFunctionLastName} />
            <NameWithInput name='Prénom : ' type='none' placeholder={"Prénom"} height={40}
              value={this.state.name} secureTextEntry={false} parentCallback={this.callbackFunctionName} />
            <NameWithInput name="Nom d'utilisateur:" type='username' placeholder={"Pseudonyme"} height={40}
              value={this.state.username} secureTextEntry={false} parentCallback={this.callbackFunctionUsername} />
            <NameWithInput name={'Mot de passe \nactuel : '} type='password' placeholder={"********"} height={40}
              value={this.state.current_password} secureTextEntry={true} parentCallback={this.callbackFunctionCurrentPassword} />
            <NameWithInput name={'Nouveau \nmot de passe : '} type='password' placeholder={"********"} height={40}
              value={this.state.new_password} secureTextEntry={true} parentCallback={this.callbackFunctionNewPassword} />
            <NameWithInput name={"Confirmez votre \nmot de passe : "} type='password' placeholder={"********"} height={40}
              value={this.state.confirmedPassword} secureTextEntry={true} parentCallback={this.callbackFunctionConfirmedPassword} />
            <NameWithInput name='Email : ' type='emailAddress' placeholder={"Email"} height={40}
              value={this.state.email} secureTextEntry={false} parentCallback={this.callbackFunctionEmail} />
            <View style={styles.date_container} >
              <Text style={[styles.text, { marginLeft: 5 }]}>Date de naissance : </Text>
              <DateTimePicker mode='date' name={this.state.birthDate} width={200} marginRight={25} parentCallback={this.callbackFunctionBirthDate} />
            </View>
            <NameWithInput name='Biographie : ' type='none' placeholder={"Biographie"} height={200} multiline={true}
              value={this.state.biography} secureTextEntry={false} parentCallback={this.callbackFunctionBibliography} />
          </KeyboardAwareScrollView>
        </View>
        <View style={styles.buttons_container}>
          <CustomButton name="Enregistrer" width={200} onPress={this.saveProfile} />
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
    margin: 7,
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
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginBottom: 5
  }

});