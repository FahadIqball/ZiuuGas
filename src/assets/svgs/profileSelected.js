import * as React from "react"
import Svg, { Path } from "react-native-svg"

function profileSelected(props) {
  return (
    <Svg
      width={20}
      height={23}
      viewBox="0 0 20 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14.731 14.245a4.292 4.292 0 014.292 4.292v3.713h-.5c.07.173.241.249.246.25h-.782l-2.07-.001H.25v-3.962c0-2.37 1.92-4.292 4.29-4.292h10.191zM9.637.25a6.126 6.126 0 016.123 6.123 6.126 6.126 0 01-6.123 6.123 6.126 6.126 0 01-6.124-6.123A6.127 6.127 0 019.637.25z"
        fill="#008BF6"
        stroke="#008BF6"
        strokeWidth={0.5}
      />
    </Svg>
  )
}

export default profileSelected
