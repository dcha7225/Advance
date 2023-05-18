import { StyleSheet, Text , SafeAreaView, Image } from 'react-native';
import MenuBar from '../components/MenuBar';
export default function ChartScreen() {
  return (
    <SafeAreaView style={styles.background}>
      <Text>Hello man</Text>
      <MenuBar/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});
