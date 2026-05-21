import * as React from "react"
import Svg, { Path } from "react-native-svg"

function homeSelected(props) {
    return (
        <Svg
            width={24}
            height={20}
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M23.653 7.492L14.597.853a4.38 4.38 0 00-5.194 0L.346 7.492A.838.838 0 00.17 8.674a.867.867 0 001.2.175l.917-.673v7.47C2.286 18.044 4.269 20 6.703 20H17.3c2.432 0 4.415-1.955 4.415-4.355V8.176l.917.673a.866.866 0 001.2-.175.837.837 0 00-.178-1.182zm-9.367 10.224a.599.599 0 01-.603.594h-3.366a.597.597 0 01-.603-.594v-3.882c0-.326.27-.594.603-.594h3.368c.332 0 .603.265.603.595v3.88h-.002z"
                fill="#008BF6"
            />
        </Svg>
    )
}

export default homeSelected
