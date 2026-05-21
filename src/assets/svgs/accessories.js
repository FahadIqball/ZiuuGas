import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M14.727 7.363H7.93V.566c0-.311.255-.566.566-.566h6.23c.312 0 .567.255.567.566v6.23a.568.568 0 01-.566.567zM6.797 15.293H.567A.568.568 0 010 14.726v-6.23c0-.312.255-.567.566-.567h6.797v6.797a.568.568 0 01-.566.567zM11.611 15.293a3.682 3.682 0 110-7.364 3.682 3.682 0 010 7.364zM3.682 7.363a3.682 3.682 0 110-7.363 3.682 3.682 0 010 7.363z"
                fill="#008BF6"
            />
        </Svg>
    )
}

export default SvgComponent
