import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import {ACCOUNT_LOGIN, ACCOUNT_VALIDATEVCODE} from '../../../utils/pathMap';
import request from '../../../utils/request';
import {Input} from 'react-native-elements';
import {pxToDp} from '../../../utils/stylesKits';
import validator from '../../../utils/validator';
import THBtn from '../../../components/THBtn';
import ThBtn from '../../../components/THBtn';
import {CodeField, Cursor} from 'react-native-confirmation-code-field';
import Toast from '../../../utils/Toast';
import {inject, observer} from 'mobx-react';
@inject('RootStore')
@observer
class Index extends Component {
  state = {
    // 手机号码
    phoneNumber: '15915992345',
    // 手机号码是否合法
    phoneValid: true,
    // 是否显示登录页面
    showLogin: true,
    // 输入的验证码
    vcodeTxt: '',
    // 倒计时按钮的文本
    btnText: '重新获取',
    // 是否在倒计时中
    isCountDowning: false,
  };

  // 登录框手机号码输入
  phoneNumberChangeText = phoneNumber => {
    this.setState({phoneNumber});
  };

  // 手机号码点击完成的时候触发
  phoneNumberSubmitEditing = async () => {
    // console.log(`手机号点击完成`)
    const {phoneNumber} = this.state;
    const phoneValid = validator.validatePhone(phoneNumber);
    if (!phoneValid) {
      // 没有通过
      this.setState({phoneValid});
      return;
    }

    const res = await request.post(ACCOUNT_LOGIN, {phone: phoneNumber});
    if (res.code == '10000') {
      // 请求成功
      this.setState({showLogin: false});
      // 开启定时器
      this.countDown();
    } else {
    }
  };

  // 开启获得验证码的定时器s
  countDown = () => {
    console.log(`开启倒计时`);
    if (this.state.isCountDowning) return;

    this.setState({isCountDowning: true});

    let seconds = 5;
    this.setState({btnText: `重新获取(${seconds}s)`});
    let timeId = setInterval(() => {
      seconds--;
      this.setState({btnText: `重新获取(${seconds}s)`});
      if (seconds === 0) {
        clearInterval(timeId);
        this.setState({btnText: `重新获取`, isCountDowning: false});
      }
    }, 1000);
  };

  // 验证码输入完毕事件
  onVcodeSubmitEditing = async () => {
    const {vcodeTxt, phoneNumber} = this.state;
    if (vcodeTxt.length != 6) {
      Toast.message('验证码不正确', 2000, 'center');
      return;
    }
    const res = await request.post(ACCOUNT_VALIDATEVCODE, {
      phone: phoneNumber,
      vcode: vcodeTxt,
    });
    if (res.code != '10000') {
      console.log(`res`, res);
      return;
    }

    //  存储用户数据到 mobx中
    this.props.RootStore.setUserInfo(phoneNumber, res.data.token, res.data.id);

    //存储用户数据到缓存中
    AsyncStorage.setItem(
      'userinfo',
      JSON.stringify({
        mobile: phoneNumber,
        token: res.data.token,
        userId: res.data.id,
      }),
    );
    if (res.data.isNew) {
      // 新用户
      this.props.navigation.navigate('UserInfo');
    } else {
      // 老用户
      this.props.navigation.navigate('Tabbar');
    }
  };

  // 点击获取验证码
  handleGetVCode() {
    console.log('44444');
  }

  // 验证码输入值的改变
  onVcodeChangeText = vcodeTxt => {
    this.setState({vcodeTxt});
  };

  // 点击重新获取按钮
  repGetVcode = () => {
    this.countDown();
  };

  // 渲染登陆页面
  renderLogin = () => {
    const {phoneNumber, phoneValid} = this.state;
    return (
      <View>
        <View>
          <Text
            style={{
              fontSize: pxToDp(25),
              color: '#888',
              fontWeight: 'bold',
            }}>
            手机号登陆注册
          </Text>
        </View>
        <View style={{marginTop: pxToDp(25)}}>
          <Input
            placeholder="请输入手机号码"
            maxLength={11}
            keyboardType="phone-pad"
            value={phoneNumber}
            inputStyle={{color: '#333'}}
            onChangeText={this.phoneNumberChangeText}
            errorMessage={phoneValid ? '' : '手机号码格式不正确'}
            onSubmitEditing={this.phoneNumberSubmitEditing}
            leftIcon={{
              type: 'font-awesome',
              color: '#ccc',
              size: pxToDp(20),
              name: 'phone',
            }}
          />
        </View>
        <View>
          <View>
            <THBtn
              onPress={this.phoneNumberSubmitEditing}
              style={{
                alignSelf: 'center',
                width: '85%',
                height: pxToDp(40),
                borderRadius: pxToDp(20),
              }}>
              获取验证码
            </THBtn>
          </View>
        </View>
      </View>
    );
  };
  // 渲染填写验证码
  renderVCode = () => {
    const {phoneNumber, vcodeTxt, btnText, isCountDowning} = this.state;
    return (
      <View>
        <View>
          <Text
            style={{fontSize: pxToDp(25), color: '#888', fontWeight: 'bold'}}>
            输入6位验证码
          </Text>
        </View>
        <View style={{marginTop: pxToDp(10)}}>
          <Text style={{color: '#333'}}>已发到：+86{phoneNumber}</Text>
        </View>
        <View>
          <CodeField
            onSubmitEditing={this.onVcodeSubmitEditing}
            value={vcodeTxt}
            onChangeText={this.onVcodeChangeText}
            cellCount={6}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
        <View>
          <ThBtn
            disabled={isCountDowning}
            onPress={this.repGetVcode}
            style={{
              alignSelf: 'center',
              width: '85%',
              height: pxToDp(40),
              borderRadius: pxToDp(20),
              marginTop: pxToDp(30),
            }}>
            {btnText}
          </ThBtn>
        </View>
      </View>
    );
  };
  render() {
    const {showLogin} = this.state;
    return (
      <View>
        <StatusBar backgroundColor="transparent" translucent={true} />
        <Image
          style={{width: '100%', height: pxToDp(220)}}
          source={require('../../../res/profileBackground.jpg')}
        />

        <View style={{padding: pxToDp(20)}}>
          {showLogin ? this.renderLogin() : this.renderVCode()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderBottomWidth: 2,
    borderColor: '#7d53ea',
    textAlign: 'center',
    color: '#7d53ea',
  },
  focusCell: {
    borderColor: '#7d53ea',
  },
});
export default Index;
