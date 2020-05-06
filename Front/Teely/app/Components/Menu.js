// app/Components/Menu.js
import React from 'react';
import { StyleSheet, TouchableOpacity, View} from 'react-native';

import MenuButton from '../Components/MenuButton'
import { useNavigation } from '@react-navigation/native'

import ProfileIcon from '../Components/ProfileIcon'

class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            open :false
        }
    }


    toggleOpen (){
        this.setState({ open: !this.state.open });
    }

    render() {
        const idImageProfile = this.props.idImageProfile
        const open = this.props.open
        const { navigation } = this.props
        return (
            <View style={styles.menu}>
              <TouchableOpacity onPress={ this.toggleOpen} style={{ flex: 1 }} >
                <ProfileIcon idImage={idImageProfile} />
              </TouchableOpacity>
              <View style={{ flex: 12 }}>
                <MenuButton name='Profil' onPress={() => navigation.navigate("Profile")} />
                <MenuButton name='Calendrier' onPress={() => navigation.navigate("PersonalCalendar")} />
                <MenuButton name='Groupes' onPress={() => navigation.navigate("Groups")} />
                <MenuButton name='Invitations' onPress={() => navigation.navigate("Invitations", { invitations: this.invitations })} />
                <MenuButton name='Paramètres' onPress={() => navigation.navigate("EditProfile")} />
                <MenuButton name='Déconnexion'  onPress={() => {
                  accountServices.logout()
                  navigation.navigate("Login")
                }} />
              </View>
            </View>
          )
      }
}

export default function (props) {
    const navigation = useNavigation()
    return <Menu {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
menu: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "#ffb4e2",
    padding: 0
},
});
