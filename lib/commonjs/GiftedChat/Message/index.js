"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _Avatar = require("../Avatar");
var _Bubble = _interopRequireDefault(require("../Bubble"));
var _SystemMessage = require("../SystemMessage");
var _utils = require("../utils");
var _styles = _interopRequireDefault(require("./styles"));
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } /* eslint-disable react-native/no-inline-styles */ /* eslint-disable @typescript-eslint/no-shadow */
/** Shallow comparison of message properties that affect rendering */
function shallowMessageEqual(a, b) {
  var _a$file, _b$file, _a$reactionEmoji, _b$reactionEmoji, _a$messageReply, _b$messageReply;
  if (a === b) return true;
  if (!a || !b) return false;
  return a._id === b._id && a.text === b.text && a.sent === b.sent && a.received === b.received && a.pending === b.pending && a.isSending === b.isSending && a.errorMessage === b.errorMessage && a.isShowName === b.isShowName && a.isLast === b.isLast && a.system === b.system && ((_a$file = a.file) === null || _a$file === void 0 ? void 0 : _a$file.length) === ((_b$file = b.file) === null || _b$file === void 0 ? void 0 : _b$file.length) && ((_a$reactionEmoji = a.reactionEmoji) === null || _a$reactionEmoji === void 0 ? void 0 : _a$reactionEmoji.length) === ((_b$reactionEmoji = b.reactionEmoji) === null || _b$reactionEmoji === void 0 ? void 0 : _b$reactionEmoji.length) && ((_a$messageReply = a.messageReply) === null || _a$messageReply === void 0 ? void 0 : _a$messageReply._id) === ((_b$messageReply = b.messageReply) === null || _b$messageReply === void 0 ? void 0 : _b$messageReply._id);
}
let Message = props => {
  const {
    currentMessage,
    renderBubble: renderBubbleProp,
    renderSystemMessage: renderSystemMessageProp,
    onMessageLayout,
    nextMessage,
    position,
    containerStyle,
    user,
    showUserAvatar,
    onPressFile,
    onLongPressReaction
  } = props;
  const renderBubble = (0, _react.useCallback)(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      containerStyle,
      onMessageLayout,
      ...rest
    } = props;
    if (renderBubbleProp) return renderBubbleProp(rest);
    return /*#__PURE__*/_react.default.createElement(_Bubble.default, _extends({}, rest, {
      onPressFile: onPressFile,
      onLongPressReaction: onLongPressReaction
    }));
  }, [props, renderBubbleProp, onPressFile, onLongPressReaction]);
  const renderSystemMessage = (0, _react.useCallback)(() => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props;
    if (renderSystemMessageProp) return renderSystemMessageProp(rest);
    return /*#__PURE__*/_react.default.createElement(_SystemMessage.SystemMessage, rest);
  }, [props, renderSystemMessageProp]);
  const renderAvatar = (0, _react.useCallback)(() => {
    var _currentMessage$user;
    if (user !== null && user !== void 0 && user._id && currentMessage !== null && currentMessage !== void 0 && currentMessage.user && user._id === currentMessage.user._id && !showUserAvatar) return null;
    if ((currentMessage === null || currentMessage === void 0 || (_currentMessage$user = currentMessage.user) === null || _currentMessage$user === void 0 ? void 0 : _currentMessage$user.avatar) === null) return null;
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      containerStyle,
      onMessageLayout,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = props;
    return /*#__PURE__*/_react.default.createElement(_Avatar.Avatar, rest);
  }, [props, user, currentMessage, showUserAvatar]);
  if (!currentMessage) return null;
  const sameUser = (0, _utils.isSameUser)(currentMessage, nextMessage);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    onLayout: onMessageLayout
  }, currentMessage.system ? renderSystemMessage() : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_styles.default[position].container, {
      marginBottom: sameUser ? 2 : 10
    }, !props.inverted && {
      marginBottom: 2
    }, containerStyle === null || containerStyle === void 0 ? void 0 : containerStyle[position]]
  }, position === 'left' ? renderAvatar() : null, renderBubble(), position === 'right' ? renderAvatar() : null));
};
Message = /*#__PURE__*/(0, _react.memo)(Message, (props, nextProps) => {
  var _props$shouldUpdateMe;
  const shouldUpdate = ((_props$shouldUpdateMe = props.shouldUpdateMessage) === null || _props$shouldUpdateMe === void 0 ? void 0 : _props$shouldUpdateMe.call(props, props, nextProps)) || !shallowMessageEqual(props.currentMessage, nextProps.currentMessage) || !shallowMessageEqual(props.previousMessage, nextProps.previousMessage) || !shallowMessageEqual(props.nextMessage, nextProps.nextMessage);
  if (shouldUpdate) return false;
  return true;
});
var _default = exports.default = Message;
//# sourceMappingURL=index.js.map