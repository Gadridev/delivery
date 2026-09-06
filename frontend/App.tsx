import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStackParamList } from './src/types/delivery';
import { initApiUrl } from './src/config/api';

import { DeliveryListScreen } from './src/screens/DeliveryListScreen';
import { DeliveryDetailScreen } from './src/screens/DeliveryDetailScreen';
import { CreateDeliveryScreen } from './src/screens/CreateDeliveryScreen';
import { EditDeliveryScreen } from './src/screens/EditDeliveryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initApiUrl();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="DeliveryList"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F8FAFC' },
          }}
        >
          <Stack.Screen name="DeliveryList" component={DeliveryListScreen} />
          <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
          <Stack.Screen name="CreateDelivery" component={CreateDeliveryScreen} />
          <Stack.Screen name="EditDelivery" component={EditDeliveryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
