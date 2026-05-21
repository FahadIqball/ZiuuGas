import * as React from "react"
import Svg, { Path } from "react-native-svg"

function profile(props) {
  return (
    <Svg
      width={18}
      height={22}
      viewBox="0 0 18 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13.295 13.227c2.43 0 4.401 1.97 4.401 4.4v.25h0v3.26a.612.612 0 01-.613.613H.863a.612.612 0 01-.613-.612v-3.51c0-2.43 1.97-4.401 4.401-4.401h8.644zM4.652 14.45a3.178 3.178 0 00-3.177 3.177v2.898h14.997v-2.94a3.177 3.177 0 00-3.176-3.135H4.652zM8.974.25a5.958 5.958 0 015.955 5.955 5.959 5.959 0 01-5.955 5.955 5.96 5.96 0 01-5.956-5.955A5.959 5.959 0 018.974.25zm0 1.225a4.733 4.733 0 00-4.732 4.73 4.734 4.734 0 004.732 4.732 4.732 4.732 0 000-9.462z"
        fill="#8E9AAF"
        stroke="#8E9AAF"
        strokeWidth={0.5}
      />
    </Svg>
  )
}

export default profile
