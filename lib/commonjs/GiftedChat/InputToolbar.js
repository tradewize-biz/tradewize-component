"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputToolbar = InputToolbar;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _Composer = require("./Composer");
var _Send = require("./Send");
var _Actions = require("./Actions");
var _Color = _interopRequireDefault(require("./Color"));
var _reactNativeFastImage = _interopRequireDefault(require("react-native-fast-image"));
var _utils = require("./utils");
var _utils2 = require("../utils");
var _ButtonBase = require("../ButtonBase");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function InputToolbar(props) {
  var _messageReaction$user;
  const {
    renderActions,
    onPressActionButton,
    renderComposer,
    renderSend,
    renderAccessory,
    options,
    optionTintColor,
    icon,
    wrapperStyle,
    containerStyle,
    onPressPickMedia,
    fileMedia,
    onRemoveFile,
    onPressFile,
    messageReaction,
    clearMessageReaction,
    labelReaction,
    onFocusInput,
    onBlurInput,
    messageContentReaction,
    isMe
  } = props;
  const actionsFragment = (0, _react.useMemo)(() => {
    const props = {
      onPressActionButton,
      options,
      optionTintColor,
      icon,
      wrapperStyle,
      containerStyle,
      onPressPickMedia
    };
    return (renderActions === null || renderActions === void 0 ? void 0 : renderActions(props)) || onPressActionButton && /*#__PURE__*/_react.default.createElement(_Actions.Actions, props);
  }, [renderActions, onPressActionButton, options, optionTintColor, icon, wrapperStyle, containerStyle, onPressPickMedia]);
  const composerFragment = (0, _react.useMemo)(() => {
    return (renderComposer === null || renderComposer === void 0 ? void 0 : renderComposer(props)) || /*#__PURE__*/_react.default.createElement(_Composer.Composer, _extends({
      ref: props === null || props === void 0 ? void 0 : props.inputRef
    }, props, {
      onPressPickMedia: props.onPressPickMedia,
      onFocus: onFocusInput,
      onBlur: onBlurInput
    }));
  }, [renderComposer, props, onFocusInput, onBlurInput]);
  const renderFileMedia = (0, _react.useMemo)(() => {
    if (!(fileMedia !== null && fileMedia !== void 0 && fileMedia.length)) return null;
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.previewFile
    }, fileMedia === null || fileMedia === void 0 ? void 0 : fileMedia.map(item => {
      return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
        onPress: () => {
          onPressFile === null || onPressFile === void 0 || onPressFile(item);
        },
        key: item.id,
        style: [styles.previewFileItem, {
          width: (0, _utils2.getScreenWidth)() * 0.22,
          height: (0, _utils2.getScreenWidth)() * 0.22
        }]
      }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
        onPress: () => {
          onRemoveFile === null || onRemoveFile === void 0 || onRemoveFile(item);
        },
        style: [styles.removeFile, {
          width: (0, _utils2.getScreenWidth)() * 0.06,
          height: (0, _utils2.getScreenWidth)() * 0.06
        }]
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: styles.removeFileText
      }, "X")), /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
        source: {
          uri: item.thumbnailPreview
        },
        style: styles.previewFileItemImage
      }), item.typeFile === 'video' && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: [styles.iconPlayContainer, {
          width: (0, _utils2.getScreenWidth)() * 0.1,
          height: (0, _utils2.getScreenWidth)() * 0.1,
          top: (0, _utils2.getScreenWidth)() * 0.22 / 2 - (0, _utils2.getScreenWidth)() * 0.1 / 2,
          right: (0, _utils2.getScreenWidth)() * 0.22 / 2 - (0, _utils2.getScreenWidth)() * 0.1 / 2
        }]
      }, /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
        source: require('./assets/play.png'),
        style: styles.iconPlay
      })), item.typeFile === 'video' && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: styles.previewFileItemVideo
      }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
        style: styles.previewFileItemVideoText
      }, (0, _utils.formatDurationSmart)((item === null || item === void 0 ? void 0 : item.duration) || 0))));
    }));
  }, [fileMedia, onRemoveFile, onPressFile]);
  const renderMessageReaction = (0, _react.useCallback)(() => {
    var _messageReaction$file, _messageReaction$file2;
    if (!(messageReaction !== null && messageReaction !== void 0 && messageReaction.text) && !(messageReaction !== null && messageReaction !== void 0 && messageReaction.file)) return null;
    if (messageReaction !== null && messageReaction !== void 0 && messageReaction.text && (!(messageReaction !== null && messageReaction !== void 0 && messageReaction.file) || (messageReaction === null || messageReaction === void 0 || (_messageReaction$file = messageReaction.file) === null || _messageReaction$file === void 0 ? void 0 : _messageReaction$file.length) <= 0)) {
      return messageReaction === null || messageReaction === void 0 ? void 0 : messageReaction.text;
    }
    if (messageReaction !== null && messageReaction !== void 0 && messageReaction.file && (messageReaction === null || messageReaction === void 0 || (_messageReaction$file2 = messageReaction.file) === null || _messageReaction$file2 === void 0 ? void 0 : _messageReaction$file2.length) > 0) {
      if (messageContentReaction) {
        return messageContentReaction;
      }
      return 'File media';
    }
    return null;
  }, [messageReaction, messageContentReaction]);
  const renderFilePreview = (0, _react.useMemo)(() => {
    var _messageReaction$file3, _messageReaction$file4, _messageReaction$file6, _messageReaction$file7, _messageReaction$file8, _messageReaction$file9, _messageReaction$file0;
    if (!(messageReaction !== null && messageReaction !== void 0 && messageReaction.file)) return null;
    if ((messageReaction === null || messageReaction === void 0 || (_messageReaction$file3 = messageReaction.file) === null || _messageReaction$file3 === void 0 ? void 0 : _messageReaction$file3.length) <= 0) return null;
    if ((messageReaction === null || messageReaction === void 0 || (_messageReaction$file4 = messageReaction.file) === null || _messageReaction$file4 === void 0 ? void 0 : _messageReaction$file4.length) <= 3) {
      var _messageReaction$file5;
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, messageReaction === null || messageReaction === void 0 || (_messageReaction$file5 = messageReaction.file) === null || _messageReaction$file5 === void 0 ? void 0 : _messageReaction$file5.map((item, index) => {
        return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: styles.filePreview,
          key: `${item === null || item === void 0 ? void 0 : item.id} + ${item === null || item === void 0 ? void 0 : item.name} + ${index}`
        }, /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
          source: {
            uri: (item === null || item === void 0 ? void 0 : item.thumbnailPreview) || (item === null || item === void 0 ? void 0 : item.uri)
          },
          style: styles.filePreviewImage
        }));
      }));
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, messageReaction === null || messageReaction === void 0 || (_messageReaction$file6 = messageReaction.file) === null || _messageReaction$file6 === void 0 || (_messageReaction$file6 = _messageReaction$file6.filter((_item, index) => index < 2)) === null || _messageReaction$file6 === void 0 ? void 0 : _messageReaction$file6.map((item, index) => {
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: styles.filePreview,
        key: `${item === null || item === void 0 ? void 0 : item.id} + ${item === null || item === void 0 ? void 0 : item.name} + ${index}`
      }, /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
        source: {
          uri: (item === null || item === void 0 ? void 0 : item.thumbnailPreview) || (item === null || item === void 0 ? void 0 : item.uri)
        },
        style: styles.filePreviewImage
      }));
    }), /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(_reactNativeFastImage.default, {
      source: {
        uri: (messageReaction === null || messageReaction === void 0 || (_messageReaction$file7 = messageReaction.file[2]) === null || _messageReaction$file7 === void 0 ? void 0 : _messageReaction$file7.thumbnailPreview) || (messageReaction === null || messageReaction === void 0 || (_messageReaction$file8 = messageReaction.file[2]) === null || _messageReaction$file8 === void 0 ? void 0 : _messageReaction$file8.uri)
      },
      style: [styles.filePreview, {
        opacity: 0.5
      }]
    }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.filePreviewMore
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.filePreviewMoreText
    }, "+", (messageReaction === null || messageReaction === void 0 || (_messageReaction$file9 = messageReaction.file) === null || _messageReaction$file9 === void 0 ? void 0 : _messageReaction$file9.length) - 2 > 99 ? '99' : (messageReaction === null || messageReaction === void 0 || (_messageReaction$file0 = messageReaction.file) === null || _messageReaction$file0 === void 0 ? void 0 : _messageReaction$file0.length) - 2))));
  }, [messageReaction]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, containerStyle]
  }, messageReaction && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.messageReaction
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.messageReactionContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: styles.messageReactionText
  }, labelReaction ? labelReaction : `Are replying ${isMe ? 'yourself' : messageReaction === null || messageReaction === void 0 || (_messageReaction$user = messageReaction.user) === null || _messageReaction$user === void 0 ? void 0 : _messageReaction$user.name}`), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    numberOfLines: 2,
    style: styles.messageReactionContent
  }, renderMessageReaction())), renderFilePreview, /*#__PURE__*/_react.default.createElement(_ButtonBase.ButtonBase, {
    activeOpacity: 0.7,
    variant: "ghost",
    title: "X",
    onPress: () => {
      clearMessageReaction === null || clearMessageReaction === void 0 || clearMessageReaction();
    },
    style: styles.messageReactionCloseButton,
    textStyle: styles.messageReactionClose
  })), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.primary, props.primaryStyle]
  }, actionsFragment, composerFragment, (renderSend === null || renderSend === void 0 ? void 0 : renderSend(props)) || /*#__PURE__*/_react.default.createElement(_Send.Send, props)), renderAccessory && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.accessory, props.accessoryStyle]
  }, renderAccessory(props)), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    entering: _reactNativeReanimated.SlideInDown.duration(300),
    exiting: _reactNativeReanimated.SlideOutUp.duration(300),
    layout: _reactNativeReanimated.Layout
  }, renderFileMedia));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    borderTopWidth: _reactNative.StyleSheet.hairlineWidth,
    borderTopColor: _Color.default.defaultColor,
    backgroundColor: _Color.default.white,
    paddingTop: 8,
    paddingHorizontal: 16
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  accessory: {
    height: 44
  },
  previewFile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8
  },
  previewFileItem: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: _Color.default.defaultColor,
    borderWidth: 1,
    borderColor: _Color.default.defaultColor
  },
  previewFileItemImage: {
    width: '100%',
    height: '100%'
  },
  previewFileItemVideo: {
    position: 'absolute',
    bottom: 2,
    right: 4
  },
  previewFileItemVideoText: {
    color: _Color.default.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  removeFile: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: _Color.default.defaultColor,
    borderRadius: 100,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: _Color.default.white
  },
  removeFileText: {
    color: _Color.default.white,
    fontSize: 14,
    fontWeight: 'bold'
  },
  iconPlay: {
    width: 24,
    height: 24,
    marginLeft: 4
  },
  iconPlayContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 100
  },
  messageReactionContainer: {
    flex: 1
  },
  messageReaction: {
    backgroundColor: _Color.default.white,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  messageReactionText: {
    color: _Color.default.black,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20
  },
  messageReactionContent: {
    color: _Color.default.black,
    fontSize: 14,
    lineHeight: 20
  },
  messageReactionClose: {
    color: _Color.default.black,
    fontSize: 18,
    fontWeight: '500'
  },
  messageReactionCloseButton: {
    width: (0, _utils2.getScreenWidth)() * 0.07,
    height: (0, _utils2.getScreenWidth)() * 0.07,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  filePreview: {
    width: (0, _utils2.getScreenWidth)() * 0.1,
    height: (0, _utils2.getScreenWidth)() * 0.1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: _Color.default.defaultColor,
    borderWidth: 1,
    borderColor: _Color.default.defaultColor,
    marginLeft: 4
  },
  filePreviewImage: {
    width: '100%',
    height: '100%'
  },
  filePreviewMore: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filePreviewMoreText: {
    color: _Color.default.white,
    fontSize: 14,
    fontWeight: 'bold'
  }
});
//# sourceMappingURL=InputToolbar.js.map