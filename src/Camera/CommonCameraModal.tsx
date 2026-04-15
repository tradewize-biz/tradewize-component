import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Modal,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { CameraComponent } from './CameraComponent';
import type { CameraProps } from './CameraComponent';
import { Camera } from 'react-native-vision-camera';
import { ButtonBase } from '../ButtonBase';

type PermissionStatus =
  | 'idle'
  | 'checking'
  | 'granted'
  | 'denied'
  | 'blocked';

export interface CameraModalProps extends Omit<CameraProps, 'onClose'> {
  visible: boolean;
  onClose: () => void;
  /**
   * Animation type for the modal transition.
   * - 'slide': slides up from bottom (default, recommended for camera)
   * - 'fade': fades in
   * - 'none': no animation
   */
  animationType?: 'slide' | 'fade' | 'none';
  titleErrorPermission?: string;
  txtButtonPermission?: string;
  txtRequestingPermissions?: string;
  txtOpenSettings?: string;
  txtInitializingCamera?: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({
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
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('idle');
  const [hasAudioPermission, setHasAudioPermission] =
    useState<boolean>(false);

  // Cache permission result to avoid re-requesting on subsequent opens
  const permissionGrantedRef = useRef<boolean>(false);

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
          setPermissionStatus(
            newCameraStatus === 'denied' ? 'blocked' : 'denied'
          );
          onError?.('Camera permission is required');
          return;
        }
      }

      // Check microphone permission if audio is enabled
      if (audio && (mode === 'video' || mode === 'both')) {
        const microphoneStatus = await Camera.getMicrophonePermissionStatus();
        let audioGranted = microphoneStatus === 'granted';

        if (!audioGranted) {
          const newMicrophoneStatus =
            await Camera.requestMicrophonePermission();
          audioGranted = newMicrophoneStatus === 'granted';

          if (!audioGranted) {
            onError?.(
              'Microphone permission is required for video recording with audio'
            );
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
      onError?.('Failed to request camera permissions');
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
        return (
          <View style={styles.overlayContainer}>
            <ButtonBase style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </ButtonBase>
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.statusText}>
                {permissionStatus === 'checking'
                  ? txtRequestingPermissions
                  : txtInitializingCamera}
              </Text>
            </View>
          </View>
        );

      case 'denied':
      case 'blocked':
        return (
          <View style={styles.overlayContainer}>
            <ButtonBase style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </ButtonBase>
            <View style={styles.centerContent}>
              <Text style={styles.statusText}>{titleErrorPermission}</Text>
              <ButtonBase
                style={styles.permissionButton}
                onPress={
                  permissionStatus === 'blocked'
                    ? openSettings
                    : checkAndRequestPermissions
                }
              >
                <Text style={styles.permissionButtonText}>
                  {permissionStatus === 'blocked'
                    ? txtOpenSettings
                    : txtButtonPermission}
                </Text>
              </ButtonBase>
            </View>
          </View>
        );

      case 'granted':
        return (
          <CameraComponent
            {...cameraProps}
            mode={mode}
            onClose={onClose}
            hasPermission={true}
            hasAudioPermission={hasAudioPermission}
            audio={audio}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      onShow={handleModalShow}
      supportedOrientations={['portrait']}
      statusBarTranslucent
      hardwareAccelerated
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.container}>{renderContent()}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    zIndex: 1,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
