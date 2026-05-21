import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SearchIcon(props) {
    return (
        <Svg
            width={17}
            height={17}
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M7.031 14.053a6.991 6.991 0 004.222-1.415l3.15 3.151a.985.985 0 001.255.115c.093-.078.178-.163.255-.255a.985.985 0 00-.114-1.255l-3.151-3.15a7.027 7.027 0 10-5.617 2.81zm0-12.278a5.247 5.247 0 11-5.247 5.247 5.253 5.253 0 015.247-5.247z"
                fill="#03316B"
            />
        </Svg>
    )
}

export default SearchIcon
