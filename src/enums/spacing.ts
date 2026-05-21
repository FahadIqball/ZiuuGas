import { Dimensions } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

export const WIDTH = Dimensions.get('window').width
export const HEIGHT = Dimensions.get('window').height

export { wp, hp }

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};
