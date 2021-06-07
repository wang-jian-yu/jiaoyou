import {observable, action, makeAutoObservable} from 'mobx';

class RootStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable
  mobile = '';
  // mobile = '15915992345';


  @observable
  token = '';
  // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEyNywibmFtZSI6IjE1OTE1OTkyMzQ1IiwiaWF0IjoxNjIyODk3MjUwLCJleHAiOjE2NDg4MTcyNTB9.L8vwgXi-im1Ray4nslyZ5d0LtuQYinpO9drldY8CpKs';

  @observable
  userId = '';
  // userId = '159159923451622897246626';

  @action
  setUserInfo(mobile,token, userId) {
    this.mobile = mobile;
    this.token = token;
    this.userId = userId;
  }
}

export default new RootStore();
