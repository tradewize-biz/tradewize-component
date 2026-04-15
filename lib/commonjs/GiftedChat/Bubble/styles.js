"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
var _Color = _interopRequireDefault(require("../Color"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const styles = {
  left: _reactNative.StyleSheet.create({
    container: {
      alignItems: 'flex-start'
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: _Color.default.leftBubbleBackground,
      marginRight: 60,
      minHeight: 20,
      justifyContent: 'flex-end'
    },
    containerToNext: {
      borderBottomLeftRadius: 3
    },
    containerToPrevious: {
      borderTopLeftRadius: 3
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-start'
    }
  }),
  right: _reactNative.StyleSheet.create({
    container: {
      alignItems: 'flex-end'
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: _Color.default.defaultBlue,
      marginLeft: 60,
      minHeight: 20,
      justifyContent: 'flex-end'
    },
    containerToNext: {
      borderBottomRightRadius: 3
    },
    containerToPrevious: {
      borderTopRightRadius: 3
    },
    bottom: {
      flexDirection: 'row',
      justifyContent: 'flex-end'
    }
  }),
  content: _reactNative.StyleSheet.create({
    tick: {
      fontSize: 10,
      backgroundColor: _Color.default.backgroundTransparent,
      color: _Color.default.white
    },
    tickView: {
      flexDirection: 'row',
      marginRight: 10
    },
    username: {
      top: -3,
      left: 0,
      fontSize: 12,
      backgroundColor: _Color.default.backgroundTransparent,
      color: '#aaa'
    },
    usernameView: {
      flexDirection: 'row',
      marginHorizontal: 10
    },
    layoutName: {
      paddingVertical: 2,
      width: '80%'
    },
    name: {
      fontSize: 12,
      color: _Color.default.black,
      fontWeight: 'semibold'
    },
    reactionContainer: {
      backgroundColor: _Color.default.white,
      position: 'absolute',
      minWidth: 36,
      height: 18,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: _Color.default.leftBubbleBackground,
      bottom: -32,
      zIndex: 10,
      shadowColor: _Color.default.leftBubbleBackground,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
      flexDirection: 'row',
      gap: 2
    },
    reactionEmojiText: {
      fontSize: 10
    },
    reactionCountText: {
      fontSize: 12
    },
    sendingIndicator: {
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8
    },
    errorContainer: {
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    },
    errorIcon: {
      width: 12,
      height: 12
    },
    errorText: {
      fontSize: 12,
      fontWeight: '500',
      color: _Color.default.alizarin
    }
  })
};
var _default = exports.default = styles;
//# sourceMappingURL=styles.js.map