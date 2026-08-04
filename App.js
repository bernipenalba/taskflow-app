import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddTaskScreen from './src/screens/AddTaskScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <AddTaskScreen />
    </SafeAreaProvider>
  );
}
