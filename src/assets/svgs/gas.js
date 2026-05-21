import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg
            width={12}
            height={22}
            viewBox="0 0 12 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M8.76 4.344V2.976h.312c.816 0 1.488-.672 1.488-1.488S9.888 0 9.072 0H2.928C2.112 0 1.44.672 1.44 1.488s.672 1.488 1.488 1.488h.312v1.368A3.465 3.465 0 000 7.8v3.768h12V7.8a3.465 3.465 0 00-3.24-3.456zM2.928 1.752a.292.292 0 01-.288-.288c0-.144.12-.288.288-.288h6.168c.144 0 .288.12.288.288 0 .144-.12.288-.288.288H2.928zM7.56 4.32H6.6v-.528H5.4v.528h-.96V2.952h3.12V4.32zM0 16.608c0 1.32.744 2.52 1.92 3.12v1.488h8.16v-1.488c1.176-.6 1.92-1.8 1.92-3.12v-3.84H0v3.84z"
                fill="#008BF6"
            />
        </Svg>
    )
}

export default SvgComponent
