import React, {
    Component
} from 'react';
import { View } from 'react-native';

import Webbrowser from 'react-native-webbrowser-enhanced';

class SampleApp extends Component {
    render() {
        return (
            <View style={{paddingTop:20, flex:1}}>
                <Webbrowser
                    url="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file"
                    hideHomeButton={false}
                    hideToolbar={false}
                    hideAddressBar={true}
                    hideStatusBar={false}
                    foregroundColor="#fff"
                    backgroundColor="#D61B5D"
                />
            </View>
        );
    }
}

export default SampleApp;
