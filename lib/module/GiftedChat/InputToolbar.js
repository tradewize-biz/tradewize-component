function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Layout, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { Composer } from './Composer';
import { Send } from './Send';
import { Actions } from './Actions';
import Color from './Color';
import FastImage from 'react-native-fast-image';
import { formatDurationSmart } from './utils';
import { getScreenWidth } from '../utils';
import { ButtonBase } from '../ButtonBase';
export function InputToolbar(props) {
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
  const actionsFragment = useMemo(() => {
    const props = {
      onPressActionButton,
      options,
      optionTintColor,
      icon,
      wrapperStyle,
      containerStyle,
      onPressPickMedia
    };
    return (renderActions === null || renderActions === void 0 ? void 0 : renderActions(props)) || onPressActionButton && /*#__PURE__*/React.createElement(Actions, props);
  }, [renderActions, onPressActionButton, options, optionTintColor, icon, wrapperStyle, containerStyle, onPressPickMedia]);
  const composerFragment = useMemo(() => {
    return (renderComposer === null || renderComposer === void 0 ? void 0 : renderComposer(props)) || /*#__PURE__*/React.createElement(Composer, _extends({
      ref: props === null || props === void 0 ? void 0 : props.inputRef
    }, props, {
      onPressPickMedia: props.onPressPickMedia,
      onFocus: onFocusInput,
      onBlur: onBlurInput
    }));
  }, [renderComposer, props, onFocusInput, onBlurInput]);
  const renderFileMedia = useMemo(() => {
    if (!(fileMedia !== null && fileMedia !== void 0 && fileMedia.length)) return null;
    return /*#__PURE__*/React.createElement(View, {
      style: styles.previewFile
    }, fileMedia === null || fileMedia === void 0 ? void 0 : fileMedia.map(item => {
      return /*#__PURE__*/React.createElement(TouchableOpacity, {
        onPress: () => {
          onPressFile === null || onPressFile === void 0 || onPressFile(item);
        },
        key: item.id,
        style: [styles.previewFileItem, {
          width: getScreenWidth() * 0.22,
          height: getScreenWidth() * 0.22
        }]
      }, /*#__PURE__*/React.createElement(TouchableOpacity, {
        onPress: () => {
          onRemoveFile === null || onRemoveFile === void 0 || onRemoveFile(item);
        },
        style: [styles.removeFile, {
          width: getScreenWidth() * 0.06,
          height: getScreenWidth() * 0.06
        }]
      }, /*#__PURE__*/React.createElement(Text, {
        style: styles.removeFileText
      }, "X")), /*#__PURE__*/React.createElement(FastImage, {
        source: {
          uri: item.thumbnailPreview
        },
        style: styles.previewFileItemImage
      }), item.typeFile === 'video' && /*#__PURE__*/React.createElement(View, {
        style: [styles.iconPlayContainer, {
          width: getScreenWidth() * 0.1,
          height: getScreenWidth() * 0.1,
          top: getScreenWidth() * 0.22 / 2 - getScreenWidth() * 0.1 / 2,
          right: getScreenWidth() * 0.22 / 2 - getScreenWidth() * 0.1 / 2
        }]
      }, /*#__PURE__*/React.createElement(FastImage, {
        source: require('./assets/play.png'),
        style: styles.iconPlay
      })), item.typeFile === 'video' && /*#__PURE__*/React.createElement(View, {
        style: styles.previewFileItemVideo
      }, /*#__PURE__*/React.createElement(Text, {
        style: styles.previewFileItemVideoText
      }, formatDurationSmart((item === null || item === void 0 ? void 0 : item.duration) || 0))));
    }));
  }, [fileMedia, onRemoveFile, onPressFile]);
  const renderMessageReaction = useCallback(() => {
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
  const renderFilePreview = useMemo(() => {
    var _messageReaction$file3, _messageReaction$file4, _messageReaction$file6, _messageReaction$file7, _messageReaction$file8, _messageReaction$file9, _messageReaction$file0;
    if (!(messageReaction !== null && messageReaction !== void 0 && messageReaction.file)) return null;
    if ((messageReaction === null || messageReaction === void 0 || (_messageReaction$file3 = messageReaction.file) === null || _messageReaction$file3 === void 0 ? void 0 : _messageReaction$file3.length) <= 0) return null;
    if ((messageReaction === null || messageReaction === void 0 || (_messageReaction$file4 = messageReaction.file) === null || _messageReaction$file4 === void 0 ? void 0 : _messageReaction$file4.length) <= 3) {
      var _messageReaction$file5;
      return /*#__PURE__*/React.createElement(React.Fragment, null, messageReaction === null || messageReaction === void 0 || (_messageReaction$file5 = messageReaction.file) === null || _messageReaction$file5 === void 0 ? void 0 : _messageReaction$file5.map((item, index) => {
        return /*#__PURE__*/React.createElement(View, {
          style: styles.filePreview,
          key: `${item === null || item === void 0 ? void 0 : item.id} + ${item === null || item === void 0 ? void 0 : item.name} + ${index}`
        }, /*#__PURE__*/React.createElement(FastImage, {
          source: {
            uri: (item === null || item === void 0 ? void 0 : item.thumbnailPreview) || (item === null || item === void 0 ? void 0 : item.uri)
          },
          style: styles.filePreviewImage
        }));
      }));
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, messageReaction === null || messageReaction === void 0 || (_messageReaction$file6 = messageReaction.file) === null || _messageReaction$file6 === void 0 || (_messageReaction$file6 = _messageReaction$file6.filter((_item, index) => index < 2)) === null || _messageReaction$file6 === void 0 ? void 0 : _messageReaction$file6.map((item, index) => {
      return /*#__PURE__*/React.createElement(View, {
        style: styles.filePreview,
        key: `${item === null || item === void 0 ? void 0 : item.id} + ${item === null || item === void 0 ? void 0 : item.name} + ${index}`
      }, /*#__PURE__*/React.createElement(FastImage, {
        source: {
          uri: (item === null || item === void 0 ? void 0 : item.thumbnailPreview) || (item === null || item === void 0 ? void 0 : item.uri)
        },
        style: styles.filePreviewImage
      }));
    }), /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(FastImage, {
      source: {
        uri: (messageReaction === null || messageReaction === void 0 || (_messageReaction$file7 = messageReaction.file[2]) === null || _messageReaction$file7 === void 0 ? void 0 : _messageReaction$file7.thumbnailPreview) || (messageReaction === null || messageReaction === void 0 || (_messageReaction$file8 = messageReaction.file[2]) === null || _messageReaction$file8 === void 0 ? void 0 : _messageReaction$file8.uri)
      },
      style: [styles.filePreview, {
        opacity: 0.5
      }]
    }), /*#__PURE__*/React.createElement(View, {
      style: styles.filePreviewMore
    }, /*#__PURE__*/React.createElement(Text, {
      style: styles.filePreviewMoreText
    }, "+", (messageReaction === null || messageReaction === void 0 || (_messageReaction$file9 = messageReaction.file) === null || _messageReaction$file9 === void 0 ? void 0 : _messageReaction$file9.length) - 2 > 99 ? '99' : (messageReaction === null || messageReaction === void 0 || (_messageReaction$file0 = messageReaction.file) === null || _messageReaction$file0 === void 0 ? void 0 : _messageReaction$file0.length) - 2))));
  }, [messageReaction]);
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, containerStyle]
  }, messageReaction && /*#__PURE__*/React.createElement(View, {
    style: styles.messageReaction
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.messageReactionContainer
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.messageReactionText
  }, labelReaction ? labelReaction : `Are replying ${isMe ? 'yourself' : messageReaction === null || messageReaction === void 0 || (_messageReaction$user = messageReaction.user) === null || _messageReaction$user === void 0 ? void 0 : _messageReaction$user.name}`), /*#__PURE__*/React.createElement(Text, {
    numberOfLines: 2,
    style: styles.messageReactionContent
  }, renderMessageReaction())), renderFilePreview, /*#__PURE__*/React.createElement(ButtonBase, {
    activeOpacity: 0.7,
    variant: "ghost",
    title: "X",
    onPress: () => {
      clearMessageReaction === null || clearMessageReaction === void 0 || clearMessageReaction();
    },
    style: styles.messageReactionCloseButton,
    textStyle: styles.messageReactionClose
  })), /*#__PURE__*/React.createElement(View, {
    style: [styles.primary, props.primaryStyle]
  }, actionsFragment, composerFragment, (renderSend === null || renderSend === void 0 ? void 0 : renderSend(props)) || /*#__PURE__*/React.createElement(Send, props)), renderAccessory && /*#__PURE__*/React.createElement(View, {
    style: [styles.accessory, props.accessoryStyle]
  }, renderAccessory(props)), /*#__PURE__*/React.createElement(Animated.View, {
    entering: SlideInDown.duration(300),
    exiting: SlideOutUp.duration(300),
    layout: Layout
  }, renderFileMedia));
}
const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
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
    backgroundColor: Color.defaultColor,
    borderWidth: 1,
    borderColor: Color.defaultColor
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
    color: Color.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  removeFile: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Color.defaultColor,
    borderRadius: 100,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.white
  },
  removeFileText: {
    color: Color.white,
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
    backgroundColor: Color.white,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  messageReactionText: {
    color: Color.black,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20
  },
  messageReactionContent: {
    color: Color.black,
    fontSize: 14,
    lineHeight: 20
  },
  messageReactionClose: {
    color: Color.black,
    fontSize: 18,
    fontWeight: '500'
  },
  messageReactionCloseButton: {
    width: getScreenWidth() * 0.07,
    height: getScreenWidth() * 0.07,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  filePreview: {
    width: getScreenWidth() * 0.1,
    height: getScreenWidth() * 0.1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Color.defaultColor,
    borderWidth: 1,
    borderColor: Color.defaultColor,
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
    color: Color.white,
    fontSize: 14,
    fontWeight: 'bold'
  }
});
//# sourceMappingURL=InputToolbar.js.map