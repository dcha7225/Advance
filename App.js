import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.background}>
      <Text>Hello man</Text>

      <View style={styles.menubar}>
      <View style={styles.menuBarOptions}>
        <Image source={require('./assets/graphIcon.png')} style={{
        height: "60%",
        width: "43%"
        }}/>
        <Text>Charts</Text>
      </View>
      <View style={styles.menuBarOptions}>
        <Image source={require('./assets/todayIcon.png')} style={{
          height: "60%",
          width: "50%"
          }}/>
          <Text>Today</Text>
      </View>
       <View style={styles.menuBarOptions}>
         <Image source={require('./assets/journalIcon.png')} style={{
          height: "60%",
          width: "60%"
          }}/>
        <Text> Journal </Text>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },

  menubar: {
    width:'100%',
    height: '13%',
    bottom: 0,
    position: 'absolute',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 15,
    overflow: 'hidden'
  },
  menuBarOptions:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});
