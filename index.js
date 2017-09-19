'use strict';

import React, { PropTypes } from 'react';
import {
  View,
  WebView,
  Platform,
} from 'react-native';
import WKWebView from 'react-native-wkwebview-reborn';

import BaseComponent from './BaseComponent'
import Utils from './Utils'
import Spinner from 'react-native-loading-spinner-overlay';

import styles from './styles'

import StatusBar from './StatusBar'
import AddressBar from './AddressBar'
import Toolbar from './Toolbar'

const WebViewComponent = Platform.OS === 'ios' ? WKWebView : WebView

const WEBVIEW_REF = 'webview';

const propTypes = {
    url: PropTypes.string,
    hideToolbar: PropTypes.bool,
    hideAddressBar: PropTypes.bool,
    hideStatusBar: PropTypes.bool,
    hideHomeButton: PropTypes.bool,
    hideActivityIndicator: PropTypes.bool,
    foregroundColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    onNavigationStateChange: PropTypes.func,
    renderHomeButton: PropTypes.func,
    onActionButton: PropTypes.func,
    onShouldStartLoadWithRequest: PropTypes.func
}

const defaultProps = {
    url: '',
    hideToolbar: false,
    hideAddressBar: false,
    hideStatusBar: false,
    hideHomeButton: false,
    renderHomeButton: null,
    onActionButton: null,
    hideActivityIndicator: false,
    onNavigationStateChange: ()=>{},
    onShouldStartLoadWithRequest: ()=>true,
    style: {}
}

class Webbrowser extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            status: '',
            currentUrl: Utils.sanitizeUrl(this.props.url),
            url: Utils.sanitizeUrl(this.props.url),
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            homeButtonEnabled: true,
            loading: true,
            scalesPageToFit: true,
        };

        this._bind(
            'render',
            'goBack',
            'goHome',
            'goForward',
            'reload',
            'onNavigationStateChange',
            'onShouldStartLoadWithRequest',
            'renderToolbar'
        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            url: Utils.sanitizeUrl(nextProps.url)
        });
    }

    renderAddressBar() {

        if (this.props.hideAddressBar) {
            return;
        };

        return <AddressBar
            onReload={this.reload}
            onLoad={(url)=>{this.load(url)}}
            url={this.state.currentUrl}
            foregroundColor={this.props.foregroundColor}
        />
    }

    renderStatusBar() {

        if (this.props.hideStatusBar) {
            return;
        };

        return <StatusBar
            status={this.state.status}
            foregroundColor={this.props.foregroundColor}
        />
    }

    renderToolbar() {

        if (this.props.hideToolbar) {
            return;
        };

        return <Toolbar
            onBack={this.goBack}
            onHome={this.goHome}
            onForward={this.goForward}
            backButtonEnabled={this.state.backButtonEnabled}
            forwardButtonEnabled={this.state.forwardButtonEnabled}
            hideHomeButton={this.props.hideHomeButton}
            foregroundColor={this.props.foregroundColor}
            renderHomeButton={this.props.renderHomeButton}
            onActionButton={this.props.onActionButton}
        />;
    }

    render() {
        return (
            <View style={[styles.container, this.props.backgroundColor && {backgroundColor: this.props.backgroundColor}, this.props.style]}>
                <View style={styles.header}>
                    {this.renderStatusBar()}
                    {this.renderAddressBar()}
                </View>
                <WebViewComponent
                    ref={(c) => {this[WEBVIEW_REF] = c}}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    scalesPageToFit={this.state.scalesPageToFit}
                />
                {this.renderToolbar()}
                <Spinner visible={this.state.loading} />
            </View>
        );
    }

    goBack() {
        this[WEBVIEW_REF].goBack();
    }

    goForward() {
        this[WEBVIEW_REF].goForward();
    }

    goHome() {
        if (this.props.onActionButton) {
            this.props.onActionButton(this.props.url, this.load.bind(this));
        } else {
            this.load(this.props.url);
        }
    }

    load(url) {
        this.setState({
            url
        });
    }

    reload() {
        this[WEBVIEW_REF].reload();
    }

    onShouldStartLoadWithRequest(event) {
        return this.props.onShouldStartLoadWithRequest(event);
    }

    onNavigationStateChange(navState) {

        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            currentUrl: navState.url,
            status: navState.title,
            loading: navState.loading,
            scalesPageToFit: true
        });

        this.props.onNavigationStateChange(navState);
    }
};

Webbrowser.propTypes = propTypes;
Webbrowser.defaultProps = defaultProps;

export default Webbrowser;
