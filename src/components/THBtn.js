import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {pxToDp} from '../utils/stylesKits'
class ThBtn extends Component {
  static defaultProps = {
    styles: {},
    textStyle: {},
    disabled: false,
  };

  render() {
    return (
      <TouchableOpacity
      disabled={this.props.disabled}
       onPress = {this.props.onPress}
        style={{width: '100%', height: '100%', ...this.props.style, overflow: 'hidden'}}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#9b63cd', '#e0708c']}
          style={styles.linearGradient}>
          <Text style={{ ...styles.buttonText, ...this.props.textStyle}}>
            {this.props.children}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: pxToDp(15),
    paddingRight: pxToDp(15),
    borderRadius: pxToDp(5),
    width: '100%',
    height: '100%',
  },
  buttonText: {
    fontSize: pxToDp(18),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#ffffff',
    marginTop: pxToDp(7),
    backgroundColor: 'transparent',
  },
});

export default ThBtn;
