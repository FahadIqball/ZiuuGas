import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface GoogleIconProps {
  size?: number;
}

export const GoogleIcon: React.FC<GoogleIconProps> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#EA4335"
      d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.76 14.93 1 12 1 7.48 1 3.58 3.59 1.68 7.39l3.77 2.93C6.39 7.02 8.97 5.04 12 5.04z"
    />
    <Path
      fill="#4285F4"
      d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.75-4.87 3.75-8.48z"
    />
    <Path
      fill="#FBBC05"
      d="M5.45 10.32c-.24-.71-.37-1.47-.37-2.25s.13-1.54.37-2.25L1.68 2.89C.87 4.51.41 6.32.41 8.23c0 1.91.46 3.72 1.27 5.34l3.77-2.93c-.24-.71-.37-1.47-.37-2.25z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.66-2.84c-1.01.68-2.3 1.08-3.62 1.08-3.03 0-5.61-1.98-6.55-5.28L1.68 16.23C3.58 20.41 7.48 23 12 23z"
    />
  </Svg>
);
export default GoogleIcon;
