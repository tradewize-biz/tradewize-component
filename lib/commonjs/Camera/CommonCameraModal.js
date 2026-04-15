"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraModal = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _CameraComponent = require("./CameraComponent");
var _reactNativeVisionCamera = require("react-native-vision-camera");
var _ButtonBase = require("../ButtonBase");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CameraModal = ({
  visible,
  onClose,
  animationType = 'slide',
  audio = true,
  mode,
  onError,
  titleErrorPermission = 'Camera permission is required',
  txtButtonPermission = 'Grant Permission',
  txtRequestingPermissions = 'Requesting permissions...',
  txtOpenSettings = 'Open Settings',
  txtInitializingCamera = 'Initializing camera...',
  ...cameraProps
}) => {
  const [permissionStatus, setPermissionStatus] = (0, _react.useState)('idle');
  const [hasAudioPermission, setHasAudioPermission] = (0, _react.useState)(false);

  // Cache permission result to avoid re-requesting on subsequent opens
  const permissionGrantedRef = (0, _react.useRef)(false);
  const checkAndRequestPermissions = (0, _react.useCallback)(async () => {
    try {
      setPermissionStatus('checking');

      // Check camera permission
      const cameraStatus = await _reactNativeVisionCamera.Camera.getCameraPermissionStatus();
      let cameraGranted = cameraStatus === 'granted';
      if (!cameraGranted) {
        const newCameraStatus = await _reactNativeVisionCamera.Camera.requestCameraPermission();
        cameraGranted = newCameraStatus === 'granted';
        if (!cameraGranted) {
          // 'denied' from requestCameraPermission means permanently blocked on iOS
          setPermissionStatus(newCameraStatus === 'denied' ? 'blocked' : 'denied');
          onError === null || onError === void 0 || onError('Camera permission is required');
          return;
        }
      }

      // Check microphone permission if audio is enabled
      if (audio && (mode === 'video' || mode === 'both')) {
        const microphoneStatus = await _reactNativeVisionCamera.Camera.getMicrophonePermissionStatus();
        let audioGranted = microphoneStatus === 'granted';
        if (!audioGranted) {
          const newMicrophoneStatus = await _reactNativeVisionCamera.Camera.requestMicrophonePermission();
          audioGranted = newMicrophoneStatus === 'granted';
          if (!audioGranted) {
            onError === null || onError === void 0 || onError('Microphone permission is required for video recording with audio');
          }
        }
        setHasAudioPermission(audioGranted);
      } else {
        setHasAudioPermission(true);
      }
      permissionGrantedRef.current = true;
      setPermissionStatus('granted');
    } catch (error) {
      console.error('Error checking/requesting permissions:', error);
      onError === null || onError === void 0 || onError('Failed to request camera permissions');
      setPermissionStatus('denied');
    }
  }, [audio, mode, onError]);

  // Triggered by Modal's native onShow — no setTimeout hack needed
  const handleModalShow = (0, _react.useCallback)(() => {
    if (permissionGrantedRef.current) {
      // Already granted from a previous open, skip straight to camera
      setPermissionStatus('granted');
    } else {
      checkAndRequestPermissions();
    }
  }, [checkAndRequestPermissions]);

  // Reset visual state when modal closes (keep permission cache)
  (0, _react.useEffect)(() => {
    if (!visible) {
      setPermissionStatus('idle');
    }
  }, [visible]);
  const openSettings = (0, _react.useCallback)(() => {
    _reactNative.Linking.openSettings();
  }, []);
  const renderContent = () => {
    switch (permissionStatus) {
      case 'idle':
      case 'checking':
        return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: styles.overlayContainer
        }, /*#__PURE__*/_react.default.createElement(_ButtonBase.ButtonBase, {
          style: styles.closeButton,
          onPress: onClose
        }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
          style: styles.closeButtonText
        }, "\u2715")), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: styles.centerContent
        }, /*#__PURE__*/_react.default.createElement(_reactNative.ActivityIndicator, {
          size: "large",
          color: "#FFFFFF"
        }), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
          style: styles.statusText
        }, permissionStatus === 'checking' ? txtRequestingPermissions : txtInitializingCamera)));
      case 'denied':
      case 'blocked':
        return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: styles.overlayContainer
        }, /*#__PURE__*/_react.default.createElement(_ButtonBase.ButtonBase, {
          style: styles.closeButton,
          onPress: onClose
        }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
          style: styles.closeButtonText
        }, "\u2715")), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: styles.centerContent
        }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
          style: styles.statusText
        }, titleErrorPermission), /*#__PURE__*/_react.default.createElement(_ButtonBase.ButtonBase, {
          style: styles.permissionButton,
          onPress: permissionStatus === 'blocked' ? openSettings : checkAndRequestPermissions
        }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
          style: styles.permissionButtonText
        }, permissionStatus === 'blocked' ? txtOpenSettings : txtButtonPermission))));
      case 'granted':
        return /*#__PURE__*/_react.default.createElement(_CameraComponent.CameraComponent, _extends({}, cameraProps, {
          mode: mode,
          onClose: onClose,
          hasPermission: true,
          hasAudioPermission: hasAudioPermission,
          audio: audio
        }));
      default:
        return null;
    }
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
    visible: visible,
    animationType: animationType,
    presentationStyle: "fullScreen",
    onRequestClose: onClose,
    onShow: handleModalShow,
    supportedOrientations: ['portrait'],
    statusBarTranslucent: true,
    hardwareAccelerated: true
  }, /*#__PURE__*/_react.default.createElement(_reactNative.StatusBar, {
    barStyle: "light-content",
    backgroundColor: "transparent",
    translucent: true
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, renderContent()));
};
exports.CameraModal = CameraModal;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
//# sourceMappingURL=CommonCameraModal.js.map