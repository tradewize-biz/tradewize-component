# Camera Component

A comprehensive camera component for React Native with photo and video capture capabilities.

## Components

### CameraModal

A reusable camera modal component that wraps the CameraComponent in a native fullscreen modal for easy integration.

Uses React Native's built-in `Modal` with native transitions for optimal performance — no JS animation overhead.

#### Usage

```tsx
import { CameraModal } from './src/Camera';
import type { PhotoFile, VideoFile } from 'react-native-vision-camera';

const MyComponent = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video' | 'both'>(
    'both'
  );

  const handlePhotoCaptured = (photo: PhotoFile) => {
    console.log('Photo captured:', photo);
    setShowCamera(false);
  };

  const handleVideoRecorded = (video: VideoFile) => {
    console.log('Video recorded:', video);
    setShowCamera(false);
  };

  const handleError = (error: string) => {
    console.error('Camera error:', error);
  };

  return (
    <>
      <Button onPress={() => setShowCamera(true)}>Open Camera</Button>

      <CameraModal
        visible={showCamera}
        mode={cameraMode}
        onPhotoCaptured={handlePhotoCaptured}
        onVideoRecorded={handleVideoRecorded}
        onError={handleError}
        onClose={() => setShowCamera(false)}
        flashMode="off"
        audio={true}
      />
    </>
  );
};
```

#### Props

- `visible: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when camera is closed
- `mode?: 'photo' | 'video' | 'both'` - Camera mode (default: 'both')
- `animationType?: 'slide' | 'fade' | 'none'` - Modal transition animation (default: 'slide')
- `onPhotoCaptured?: (photo: PhotoFile) => void` - Callback when photo is captured
- `onVideoRecorded?: (video: VideoFile) => void` - Callback when video is recorded
- `onError?: (error: string) => void` - Callback for errors
- `flashMode?: 'off' | 'on'` - Flash mode (default: 'off')
- `audio?: boolean` - Enable audio for video recording (default: true)
- `initialZoom?: number` - Initial zoom level (default: 1)

### CameraComponent

The core camera component with full functionality.

### CameraExample

A complete example showing all camera features.

## Features

- 📸 Photo capture
- 🎥 Video recording with audio
- 🔄 Camera position switching (front/back)
- ⚡ Flash control
- 🔍 Zoom control with slider
- ⏸️ Video pause/resume
- 🎤 Audio recording toggle
- 📱 Full screen modal presentation (native transitions)
- 🛡️ Permission handling with caching
- ⚠️ Error handling

## Installation

Make sure you have the required dependencies:

```bash
npm install react-native-vision-camera @react-native-community/slider
```

## Permissions

The component automatically handles camera and microphone permissions. Make sure to add the following permissions to your app:

### iOS (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to camera to take photos and videos.</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone to record videos with audio.</string>
```

### Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Quick Start

1. Import the component:

```tsx
import { CameraModal } from './src/Camera';
```

2. Use it in your component:

```tsx
<CameraModal
  visible={showCamera}
  mode="both"
  onPhotoCaptured={handlePhoto}
  onVideoRecorded={handleVideo}
  onError={handleError}
  onClose={() => setShowCamera(false)}
/>
```

That's it! The camera modal will handle all the complexity for you.
