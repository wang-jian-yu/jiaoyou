// import React, {Component} from 'react';
// // import {Button, View, Text} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import Login from './pages/account/login/';
// import Demo from './pages/Demo';
// import UserInfo from './pages/account/userinfo';
// import Tabbar from './tabbar';
// // import moduleName from './mobx/index'
// import {inject, observer} from 'mobx-react';
// const Stack = createStackNavigator();

// @inject('RootStore')
// @observer
// export default class Nav extends Component {
//   constructor(props) {
//     super(props);
//     console.log('**********************');
//     console.log(props.RootStore.token);
//     this.state = {
//       initialRouteName:props.RootStore.token?"Tabbar":"Login"
//     };
//   }
//   render() {
//     const {initialRouteName} = this.state;
//     // console.log(`object2222`, initialRouteName)
//     // console.log(`object223333333333322`, this.props.RootStore)
//     return (
//       <NavigationContainer>
//         <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
//           <Stack.Screen name="Demo" component={Demo} />
//           <Stack.Screen name="Tabbar" component={Tabbar} />
//           <Stack.Screen name="Login" component={Login} />
//           <Stack.Screen name="UserInfo" component={UserInfo} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
// }



















import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './pages/account/login/';
import Demo from './pages/Demo';
import UserInfo from './pages/account/userinfo';
import Tabbar from './tabbar';
import {inject, observer} from 'mobx-react';
import {View} from 'react-native';
const Stack = createStackNavigator();

function Nav(props) {
  const initialRouteName = props.RootStore.token ? 'Tabbar' : 'Login';
  // console.log(`object2222`, initialRouteName);
  // console.log(`object223333333333322`, props.RootStore);
  return (
      <NavigationContainer>
        <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
          <Stack.Screen name="Demo" component={Demo} />
          <Stack.Screen name="Tabbar" component={Tabbar} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="UserInfo" component={UserInfo} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
export default inject('RootStore')(observer(Nav));
