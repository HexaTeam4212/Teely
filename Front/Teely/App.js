import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/Views/Login'
import SignUp from './app/Views/SignUp'

import Profile from './app/Views/Profile'
import EditProfil from './app/Views/EditProfil'
import Groups from './app/Views/Groups'
import PersonalCalendar from './app/Views/PersonalCalendar'


export default function App() {

  const Stack = createStackNavigator();

  return (
    //<EditProfil/>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'Mon profil',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Groups"
          component={Groups}
          options={{
            title: 'Mes groupes',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="PersonalCalendar"
          component={PersonalCalendar}
          options={{
            title: 'Mon calendrier personnel',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfil}
          options={{
            title: 'Edition du profil',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            title: 'Inscription',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Connexion',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft:null
          }}
        />
        <Stack.Screen
          name="EditProfil"
          component={EditProfil}
          options={{
            title: 'Modification du profil',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

}






