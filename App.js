import React, {Component} from 'react';
import {View, AsyncStorage} from 'react-native';
import Nav from './src/nav';
import Geo from './src/utils/Geo';
import RootStore from './src/mobx/';
import {Provider} from 'mobx-react';
import JMessage from './src/utils/JMessage';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
    };
  }
  async componentDidMount() {
    // 获取缓存中用户的数据
    const strUserInfo = await AsyncStorage.getItem('userinfo');
    console.log(strUserInfo);
   
    const userinfo = strUserInfo ? JSON.parse(strUserInfo) : {};
    // 判断 有没有token
    if (userinfo.token) {
      // 把缓存中的数据 存一份到mobx中
      RootStore.setUserInfo(userinfo.mobile, userinfo.token, userinfo.userId);
     
      // 极光初始化
      JMessage.init();
    }
    this.setState({
      init: true,
    });
  }

  render() {
    console.log(`init`, this.state.init);
    console.log(`strUserInfo`, this.state.strUserInfo);
    const {init} = this.state;
    return (
      <View style={{flex: 1}}>
        <Provider RootStore={RootStore}>
          {init && <Nav></Nav>}
          </Provider>
      </View>
    );
  }
}
export default App;
