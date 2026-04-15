function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Linking, Modal, StatusBar, ActivityIndicator } from 'react-native';
import { CameraComponent } from './CameraComponent';
import { Camera } from 'react-native-vision-camera';
import { ButtonBase } from '../ButtonBase';
export const CameraModal = ({
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
  const [permissionStatus, setPermissionStatus] = useState('idle');
  const [hasAudioPermission, setHasAudioPermission] = useState(false);

  // Cache permission result to avoid re-requesting on subsequent opens
  const permissionGrantedRef = useRef(false);
  const checkAndRequestPermissions = useCallback(async () => {
    try {
      setPermissionStatus('checking');

      // Check camera permission
      const cameraStatus = await Camera.getCameraPermissionStatus();
      let cameraGranted = cameraStatus === 'granted';
      if (!cameraGranted) {
        const newCameraStatus = await Camera.requestCameraPermission();
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
        const microphoneStatus = await Camera.getMicrophonePermissionStatus();
        let audioGranted = microphoneStatus === 'granted';
        if (!audioGranted) {
          const newMicrophoneStatus = await Camera.requestMicrophonePermission();
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
  const handleModalShow = useCallback(() => {
    if (permissionGrantedRef.current) {
      // Already granted from a previous open, skip straight to camera
      setPermissionStatus('granted');
    } else {
      checkAndRequestPermissions();
    }
  }, [checkAndRequestPermissions]);

  // Reset visual state when modal closes (keep permission cache)
  useEffect(() => {
    if (!visible) {
      setPermissionStatus('idle');
    }
  }, [visible]);
  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);
  const renderContent = () => {
    switch (permissionStatus) {
      case 'idle':
      case 'checking':
        return /*#__PURE__*/React.createElement(View, {
          style: styles.overlayContainer
        }, /*#__PURE__*/React.createElement(ButtonBase, {
          style: styles.closeButton,
          onPress: onClose
        }, /*#__PURE__*/React.createElement(Text, {
          style: styles.closeButtonText
        }, "\u2715")), /*#__PURE__*/React.createElement(View, {
          style: styles.centerContent
        }, /*#__PURE__*/React.createElement(ActivityIndicator, {
          size: "large",
          color: "#FFFFFF"
        }), /*#__PURE__*/React.createElement(Text, {
          style: styles.statusText
        }, permissionStatus === 'checking' ? txtRequestingPermissions : txtInitializingCamera)));
      case 'denied':
      case 'blocked':
        return /*#__PURE__*/React.createElement(View, {
          style: styles.overlayContainer
        }, /*#__PURE__*/React.createElement(ButtonBase, {
          style: styles.closeButton,
          onPress: onClose
        }, /*#__PURE__*/React.createElement(Text, {
          style: styles.closeButtonText
        }, "\u2715")), /*#__PURE__*/React.createElement(View, {
          style: styles.centerContent
        }, /*#__PURE__*/React.createElement(Text, {
          style: styles.statusText
        }, titleErrorPermission), /*#__PURE__*/React.createElement(ButtonBase, {
          style: styles.permissionButton,
          onPress: permissionStatus === 'blocked' ? openSettings : checkAndRequestPermissions
        }, /*#__PURE__*/React.createElement(Text, {
          style: styles.permissionButtonText
        }, permissionStatus === 'blocked' ? txtOpenSettings : txtButtonPermission))));
      case 'granted':
        return /*#__PURE__*/React.createElement(CameraComponent, _extends({}, cameraProps, {
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
  return /*#__PURE__*/React.createElement(Modal, {
    visible: visible,
    animationType: animationType,
    presentationStyle: "fullScreen",
    onRequestClose: onClose,
    onShow: handleModalShow,
    supportedOrientations: ['portrait'],
    statusBarTranslucent: true,
    hardwareAccelerated: true
  }, /*#__PURE__*/React.createElement(StatusBar, {
    barStyle: "light-content",
    backgroundColor: "transparent",
    translucent: true
  }), /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, renderContent()));
};
const styles = StyleSheet.create({
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