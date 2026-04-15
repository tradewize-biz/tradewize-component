import React from 'react';
import type { CameraProps } from './CameraComponent';
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
export declare const CameraModal: React.FC<CameraModalProps>;
