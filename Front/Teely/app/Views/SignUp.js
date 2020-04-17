// app/Views/SignUp.js
import React from 'react';
import InputWithName from '../Components/InputWithName'
import SubmitButton from '../Components/SubmitButton'
import { StyleSheet, View, Image} from 'react-native';

export default class SignUp extends React.Component {
  render() {
    return(
    <View style={styles.main_container}>
      <View style={styles.content_container}>
        <Image style={styles.logo} source={require('../../assets/icon.png')}/>
        <InputWithName name = "Nom d'utilisateur" type = 'username' placeholder='Pseudonyme' secureTextEntry={false}/>
        <InputWithName name = 'Mot de passe' type = 'password' placeholder='********' secureTextEntry={true}/>
        <InputWithName name = 'Confirmez votre mot de passe' type = 'password' placeholder='********' secureTextEntry={true}/>
        <InputWithName name = 'Adresse e-mail' type = 'emailAddress' placeholder='xyz@gmail.com' secureTextEntry={false}/>
        <InputWithName name = 'Nom' type = 'none' placeholder='Nom' secureTextEntry={false}/>
        <InputWithName name = 'Prénom' type = 'none' placeholder='Prénom' secureTextEntry={false}/>
        <InputWithName name = 'Date de naissance' type = 'none' placeholder='jj/mm/aaaa' secureTextEntry={false}/>
        <SubmitButton name = 'Créer mon compte'/>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  main_container : {
    backgroundColor: '#78e1db',
    flex: 1,
    
  },
  content_container : {
    flex:1,
    marginTop : 30,
    marginBottom : 20,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo : {
    resizeMode: 'contain',
    width: 100,
    height: 100,
    borderColor: '#ffb4e2',
    borderWidth : 3,
    borderRadius: 50,
    borderBottomWidth : 20
  }
  
});