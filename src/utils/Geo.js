
import { PermissionsAndroid, Platform } from "react-native";
import { init, Geolocation } from "react-native-amap-geolocation";
import axios from "axios";
import Toast from "./Toast";
class Geo {
  async initGeo() {
    if (Platform.OS === "android") {
      // await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);
    }
    await init({
      // 来自于 高德地图中的第二个应用 android 应用key
      ios: "250a1528e766f371479c3fbcac7518a8",
      android: "250a1528e766f371479c3fbcac7518a8"
    });
    return Promise.resolve();
  }
  async getCurrentPosition() {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
    await init({
      // 来自于 高德地图中的第二个应用 android 应用key
      ios: "250a1528e766f371479c3fbcac7518a8",
      android: "250a1528e766f371479c3fbcac7518a8"
    });
    return new Promise((resolve, reject) => {
      console.log("开始定位");
      Geolocation.getCurrentPosition(({ coords }) => {
        resolve(coords);
      }, reject);
    })
  }
  async getCityByLocation() {
    // Toast.showLoading("努力获取中")
    const { longitude, latitude } = await this.getCurrentPosition();
    const res = await axios.get("https://restapi.amap.com/v3/geocode/regeo", {
      // key  高德地图中第一个应用的key
      params: { location: `${longitude},${latitude}`, key: "8574006af749d479b1a8132d241cf949", }
    });
    // Toast.hideLoading();
    console.log(`res`, res.data)
    return Promise.resolve(res.data);
  }
}


export default new Geo();