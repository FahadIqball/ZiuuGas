import * as React from "react"
import Svg, { Rect, Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg
            width={33}
            height={33}
            viewBox="0 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Rect width={33} height={33} rx={16.5} fill="#D8EEFF" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.597 17l4.208-4.335a.697.697 0 00.001-.965.647.647 0 00-.937.001l-4.674 4.816-.001.002a.693.693 0 000 .964h.001L17.87 22.3a.648.648 0 00.937.002.695.695 0 00-.001-.965L14.597 17z"
                fill="#008BF6"
            />
        </Svg>
    )
}

export default SvgComponent
