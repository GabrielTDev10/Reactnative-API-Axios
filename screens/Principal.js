import React from 'react';
import { Text, View } from 'react-native';
import { CommonActions, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';// ou FontAwesome, Ionicons, etc.
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';
import PerfilScreen from './Perfil';
import FeedScreen from './Feed';
import MapsScreen from './Mapa';

const Tab = createBottomTabNavigator();

export default function Principal() {
  return (
   
      
      <Tab.Navigator>
        <Tab.Screen 
          name="Perfil" 
          component={PerfilScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="user-circle" type="font-awesome-5" color={'black'} size={30} />
            ),
          }}
          
         
        />

      <Tab.Screen 
          name="Feed" 
          component={FeedScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" type="font-awesome-5" color={'black'} size={30} />
            ),
          }}
          
         
        />


        
        <Tab.Screen 
          name="Mapa" 
          component={MapsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="map-marked-alt" type="font-awesome-5" color={'black'} size={30} />
            ),
          }}
        />
      </Tab.Navigator>
    
  );
}
