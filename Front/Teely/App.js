import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './app/Views/Login'
import SignUp from './app/Views/SignUp'
import Profile from './app/Views/Profile'
import EditProfile from './app/Views/EditProfile'
import Groups from './app/Views/Groups'

import PersonalCalendar from './app/Views/PersonalCalendar'
import DetailedGroup from './app/Views/DetailedGroup'
import Invitations from './app/Views/Invitations'
import CreateGroup from './app/Views/CreateGroup'
import EditGroup from './app/Views/EditGroup'
import GroupCalendar from './app/Views/GroupCalendar'

export default function App() {

  const Stack = createStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
            headerLeft:null
          }}
        />
        
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
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
            headerLeft:null
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
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
          }}
        />
        <Stack.Screen
          name="DetailedGroup"
          component={DetailedGroup}
          options={{
            title: 'Détails du groupe',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,fontWeight: 'bold',
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
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            title: 'Edition du profil',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
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
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
          }}
        />
        <Stack.Screen
          name="Invitations"
          component={Invitations}
          options={{
            title: 'Mes invitations',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
          }}
        />
         <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{
            title: 'Création d\'un groupe',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
          }}
        />
        <Stack.Screen
          name="GroupCalendar"
          component={GroupCalendar}
          options={{
            title: 'Calendrier du groupe',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
          }}
        />
        <Stack.Screen
          name="EditGroup"
          component={EditGroup}
          options={{
            title: 'Edition du groupe',
            headerStyle: {
              backgroundColor: '#78e1db',
            },
            headerTruncatedBackTitle: true,
            headerTintColor: 'white',
            headerTitleStyle: {
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'Roboto',
              fontWeight: 'bold',
              fontSize: 17,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

}






