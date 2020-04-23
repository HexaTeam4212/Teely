// app/Views/EditProfil.js
import React from 'react';
import NameWithInput from '../Components/NameWithInput'
import { StyleSheet, View, Image, TouchableOpacity, Text, ScrollView, Platform } from 'react-native';
import CustomButton from '../Components/CustomButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class EditProfil extends React.Component {

  afficher = () => {
    console.log("clic bouton")
  }

  render() {
    return (
      <View style={styles.main_container}>
        <View style={styles.head_container}>
          <TouchableOpacity onPress={() => this.afficher()}>
            <Image style={styles.goBack} source={require('../../assets/Images/goBack.png')} />
          </TouchableOpacity>
          <View style={styles.image_container}>
            <Image style={styles.logo} source={require('../../assets/icon.png')} />
            <TouchableOpacity style={styles.button} onPress={() => this.afficher()}>
              <Text style={styles.buttonText}>modifier</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content_container}>
          <KeyboardAwareScrollView
            contentContainerstyle={styles.content_container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            enableOnAndroid={true}>
            <NameWithInput name='Nom : ' type='none' placeholder='Nom' height={40} secureTextEntry={false} />
            <NameWithInput name='Prénom : ' type='none' placeholder='Prénom' height={40} secureTextEntry={false} />
            <NameWithInput name="Nom d'utilisateur : " type='username' placeholder='Pseudonyme' height={40} secureTextEntry={false} />
            <NameWithInput name='Mot de passe : ' type='password' placeholder='********' height={40} secureTextEntry={true} />
            <NameWithInput name={"Confirmez votre \nmot de passe : "} type='password' placeholder='********' height={40} secureTextEntry={true} />
            <NameWithInput name='Email : ' type='emailAddress' placeholder='xyz@gmail.com' height={40} secureTextEntry={false} />

            <NameWithInput name='Date de naissance : ' type='none' placeholder='jj/mm/aaaa' height={40} secureTextEntry={false} />
            <NameWithInput name='Bibliographie : ' type='none' placeholder='Bibliographie' height={200} secureTextEntry={false} />
          </KeyboardAwareScrollView>
        </View>
        <View style={styles.buttons_container}>
          <CustomButton name="Annuler" width={150} onPress={() => this.afficher()} />
          <CustomButton name="Enregistrer" width={150} onPress={() => this.afficher()} />
        </View>
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
    marginBottom: 10
  },
  head_container: {
    flex: 2,
    marginTop: 20,
    flexDirection: 'row'
  },
  image_container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttons_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10

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
    borderBottomWidth: 20
  },
  goBack: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    marginLeft: 10,
    marginTop: 10
  }

});