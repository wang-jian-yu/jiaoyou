import React, {Component} from 'react';
import {
  init,
  addLocationListener,
  start,
  stop,
} from 'react-native-amap-geolocation';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import JMessage from '../../../utils/JMessage';
import {ACCOUNT_CHECKHEADIMAGE, ACCOUNT_REGINFO} from '../../../utils/pathMap';
import request from '../../../utils/request';
import THBtn from '../../../components/THBtn';
import {pxToDp} from '../../../utils/stylesKits';
import CityJson from '../../../res/citys.json';
import {Input} from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';
import Toast from '../../../utils/Toast';
import {Overlay} from 'teaset';
import {male, female} from '../../../res/fonts/iconSvg';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
import ImagePicker from 'react-native-image-crop-picker';

import {inject, observer} from 'mobx-react';
@inject('RootStore')
@observer
export default class index extends Component {
  state = {
    // 昵称
    nickname: '1',
    // 性别
    gender: '男',
    // 生日
    birthday: '2000-03-01',
    // 城市
    city: '',
    // 头像
    header: '',
    // 经度
    lng: '',
    // 纬度
    lat: '',
    // 详细的地址
    address: '',
  };

  async componentDidMount() {
    // 对于 Android 需要自行根据需要申请权限
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    // 使用自己申请的高德 App Key 进行初始化
    await init({
      ios: '250a1528e766f371479c3fbcac7518a8',
      android: '250a1528e766f371479c3fbcac7518a8',
    });

    addLocationListener(location => {
      if (location.city) {
        this.setState({
          city: location.city,
          lng: location.longitude,
          lat: location.latitude,
          address: location.address,
        });
        stop();
      }
    });
    start();
    //
  }
  // 选择性别
  chooeseGender = gender => {
    this.setState({gender});
  };
  // 选择城市
  showCityPicker = () => {
    Picker.init({
      //  pickerData 要显示哪些数据 全国城市数据?
      pickerData: CityJson,
      // 默认选择哪个数据
      // selectedValue: ["河北", "唐山"],
      selectedValue: ['北京', '北京'],
      wheelFlex: [1, 1, 0], // 显示省和市
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: '选择城市',
      onPickerConfirm: data => {
        // data =  [广东，广州，天河]
        this.setState({
          city: data[1],
        });
      },
    });
    Picker.show();
  };

  // 点击了 设置头像按钮
  chooeseHeadImg = async () => {
    /* 
    1 校验 用户的昵称 生日 当前地址 city
    2 使用图片裁剪插件 
    3 将选择好的图片 上传到 后台 
      1 rn中想要显示gif动态图 需要做一些配置 
    4 用户的昵称 生日 当前地址 .. 头像的地址  提交到后台 -> 完成 信息填写
    5 成功 
      1 执行 极光注册 极光的登录
      2 跳转到交友-首页 
     */
    const {nickname, birthday, city} = this.state;

    if (!nickname || !birthday || !city) {
      Toast.sad('昵称或者生日或者城市不合法', 2000, 'center');
      return;
    }

    // 获取到 选中后的图片
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    });

    let overlayViewRef = null;

    // 显示审核中 效果
    let overlayView = (
      <Overlay.View
        style={{flex: 1, backgroundColor: '#000'}}
        modal={true}
        overlayOpacity={0}
        ref={v => (overlayViewRef = v)}>
        <View
          style={{
            marginTop: pxToDp(30),
            alignSelf: 'center',
            width: pxToDp(334),
            height: pxToDp(334),
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              zIndex: 100,
            }}
            source={require('../../../res/scan.gif')}
          />
          <Image
            source={{uri: image.path}}
            style={{width: '60%', height: '60%'}}
          />
        </View>
      </Overlay.View>
    );
    Overlay.show(overlayView);

    let formData = new FormData();
    formData.append('headPhoto', {
      // 本地图片的地址
      uri: image.path,
      // 图片的类型
      type: image.mime,
      // 图片的名称 file:///store/com/pic/dsf/d343.jpg
      name: image.path.split('/').pop(),
    });

    // 上传头像
    const res0 = await this.uploadHeadImg(image);

    console.log(`res0`, res0);

    // 是否上传头像成功
    if (res0.code !== '10000') {
      // 失败
      return;
    }

    // 构造参数 完善个人信息
    // state
    let params = this.state;
    params.header = res0.data.headImgPath;

    const res1 = await request.privatePost(ACCOUNT_REGINFO, params);
    console.log(`res1`, res1);
    if (res1.code !== '10000') {
      // 完善信息失败
      return;
    }
    // 注册极光  用户名 this.props.RootStore.userId 密码:默认 用户的手机号码
    const res2 = await this.jgBusiness(
      this.props.RootStore.userId,
      this.props.RootStore.mobile,
    );

    overlayViewRef.close();
    // 2 给出用户一个提示
    Toast.smile('恭喜 操作成功', 2000, 'center');

    // 3 跳转页面 交友页面  在登录页面 用户的判断 新旧用户的判断
    setTimeout(() => {
      this.props.navigation.navigate("Tabbar");
      // this.props.navigation.reset({
      //   routes: [{name: 'Tabbar'}],
      // });
      console.log('sucess');
    }, 2000);
  };
  // 上传头像
  uploadHeadImg = image => {
    // 构造参数 发送到后台 完成 头像上传
    let formData = new FormData();
    formData.append('headPhoto', {
      // 本地图片的地址
      uri: image.path,
      // 图片的类型
      type: image.mime,
      // 图片的名称 file:///store/com/pic/dsf/d343.jpg
      name: image.path.split('/').pop(),
    });
    // 因为 我们打开了 调式模式  调试工具 对网络拦截处理 导致一些请求失败
    // 不要打开任何调试工具 只使用控制台即可
    // 执行头像上传
    return request.privatePost(ACCOUNT_CHECKHEADIMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  // 执行极光注册
  jgBusiness = (username, password) => {
    // 在 App 里面 进行极光的初始化
    return JMessage.register(username, password);
  };

  render() {
    const {gender, nickname, birthday, city} = this.state;
    const dateNow = new Date();
    const currentDate = `${dateNow.getFullYear()}-${
      dateNow.getMonth() + 1
    }-${dateNow.getDate()}`;
    return (
      <View style={{backgroundColor: '#fff', flex: 1, padding: pxToDp(20)}}>
        <Text style={{fontSize: pxToDp(20), color: '#666', fontWeight: 'bold'}}>
          填写资料
        </Text>
        <Text style={{fontSize: pxToDp(20), color: '#666', fontWeight: 'bold'}}>
          提升我的魅力
        </Text>

        <View style={{marginTop: pxToDp(20)}}>
          <View
            style={{
              justifyContent: 'space-around',
              width: '60%',
              flexDirection: 'row',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={this.chooeseGender.bind(this, '男')}
              style={{
                width: pxToDp(60),
                height: pxToDp(60),
                borderRadius: pxToDp(30),
                backgroundColor: gender === '男' ? 'yellow' : '#eee',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <SvgUri svgXmlData={male} width="36" height="36" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.chooeseGender.bind(this, '女')}
              style={{
                width: pxToDp(60),
                height: pxToDp(60),
                borderRadius: pxToDp(30),
                backgroundColor: gender === '女' ? 'yellow' : '#eee',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <SvgUri svgXmlData={female} width="36" height="36" />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Input
            value={nickname}
            placeholder="设置昵称"
            onChangeText={nickname => this.setState({nickname})}
          />
        </View>

        <View>
          <DatePicker
            androidMode="spinner"
            style={{width: '100%'}}
            date={birthday}
            mode="date"
            placeholder="设置生日"
            format="YYYY-MM-DD"
            minDate="1900-01-01"
            maxDate={currentDate}
            confirmBtnText="确定"
            cancelBtnText="取消"
            customStyles={{
              dateIcon: {
                display: 'none',
              },
              dateInput: {
                marginLeft: pxToDp(10),
                borderWidth: 0,
                borderBottomWidth: pxToDp(1.1),
                alignItems: 'flex-start',
                paddingLeft: pxToDp(4),
              },
              placeholderText: {
                fontSize: pxToDp(18),
                color: '#afafaf',
              },
            }}
            onDateChange={birthday => {
              this.setState({birthday});
            }}
          />
        </View>

        <View style={{marginTop: pxToDp(20)}}>
          <TouchableOpacity onPress={this.showCityPicker}>
            <Input
              value={'当前定位:' + city}
              inputStyle={{color: '#666'}}
              disabled={true}
            />
          </TouchableOpacity>
        </View>

        <View>
          <THBtn
            onPress={this.chooeseHeadImg}
            style={{
              height: pxToDp(40),
              borderRadius: pxToDp(20),
              alignSelf: 'center',
            }}>
            设置头像
          </THBtn>
        </View>
      </View>
    );
  }
}
