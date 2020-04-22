import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/Views/Login'
import SignUp from './app/Views/SignUp'

export default function App() {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
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
            },}}
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
            },}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





