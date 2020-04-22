// app/Views/EditProfil.js
import React from 'react';
import NameWithInput from '../Components/NameWithInput'
import TwoSubmitButtons from '../Components/TwoSubmitButtons'
import { StyleSheet, View, Image, TouchableOpacity, Text, ScrollView, Platform} from 'react-native';

export default class EditProfil extends React.Component {
  render() {
    return(
    <View style={styles.main_container}>
    <View style={styles.head_container}>
    <Image style={styles.goBack} source={require('../../assets/goBack.png')}/>
        <View style={styles.image_container}>
          <Image style={styles.logo} source={require('../../assets/icon.png')}/>
          <TouchableOpacity style = {styles.button}>
            <Text style={styles.buttonText}>modifier</Text>
        </TouchableOpacity>
        </View>
    </View>
        <View style={styles.content_container}>
        <ScrollView>
        <NameWithInput name = 'Nom : ' type = 'none' placeholder='Nom' height = {40} secureTextEntry={false}/>
        <NameWithInput name = 'Prénom : ' type = 'none' placeholder='Prénom' height = {40} secureTextEntry={false}/>
        <NameWithInput name = "Nom d'utilisateur : " type = 'username' placeholder='Pseudonyme' height = {40} secureTextEntry={false}/>
        <NameWithInput name = 'Mot de passe : ' type = 'password' placeholder='********' height = {40} secureTextEntry={true}/>
        <NameWithInput name = {"Confirmez votre \nmot de passe : "} type = 'password' placeholder='********' height = {40} secureTextEntry={true}/>
        <NameWithInput name = 'Email : ' type = 'emailAddress' placeholder='xyz@gmail.com' height = {40} secureTextEntry={false}/>
       
        <NameWithInput name = 'Date de naissance : ' type = 'none' placeholder='jj/mm/aaaa' height = {40} secureTextEntry={false}/>
         <NameWithInput name = 'Bibliographie : ' type = 'none' placeholder='Bibliographie' height = {200} secureTextEntry={false}/>
         </ScrollView>
      </View>
      <TwoSubmitButtons name1="Annuler " name2="Enregistrer" />
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
    flex:7,
    marginTop : 10,
    marginBottom : 10
  },
  head_container : {
    flex:2,
    marginTop : 20,
    flexDirection : 'row'
  },
  image_container : {
    flex:1,
    flexDirection : 'column',
    alignItems: 'center',
  },
    buttonText : {
    fontSize: 14,
    color : 'black',
    fontFamily: Platform.OS === 'ios' ? 'Cochin' : 'Roboto',
    fontWeight : 'bold',
    textDecorationLine: 'underline'
  },
  button: {
    padding:5,
    backgroundColor : 'transparent',
    height: 30,
    width: 80,
    borderRadius : 30,
    justifyContent: 'center',
    alignItems: "center",
  },
  logo : {
    resizeMode: 'contain',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderColor: '#ffb4e2',
    borderWidth : 3,
    borderRadius: 50,
    borderBottomWidth : 20
  },
  goBack : {
    resizeMode: 'contain',
    width: 30,
    height: 30,
    marginLeft:10,
    marginTop:10
  }
  
});