import React from 'react';
import {View, Text} from 'react-native';
import JMessage from '../utils/JMessage';
class App extends React.Component {
  componentDidMount() {
    JMessage.init();

    JMessage.login('18665711956', '18665711956').then(console.lo);
  }
  render() {
    return (
      <View>
        <Text>goods</Text>
      </View>
    );
  }
}
export default App;
