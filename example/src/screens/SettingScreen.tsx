/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { Component } from "react";
import {
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Platform,
    Linking
} from 'react-native';

import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';

type Props = {};
class SettingScreen extends Component {


    state = {
        versionCode: ''
    }

    constructor(props: Props) {
        super(props)
        this.getVersionCode()
    }

    async getVersionCode() {
        // Get the version code of ComPDFKit SDK
        var version = await ComPDFKit.getVersionCode()
        this.setState({
            versionCode: version
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>SDK Information</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoItemText}>Versions</Text>
                    <Text style={styles.infoItemText}>ComPDFKit {this.state.versionCode} for {Platform.OS} </Text>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Company Information</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <View>{this.linkItem('https://www.compdf.com/', 'https://www.compdf.com/')}</View>
                    <View>{this.linkItem('About ComPDFKit', 'https://www.compdf.com/company/about')}</View>
                    <View>{this.linkItem('Technical Support', 'https://www.compdf.com/support')}</View>
                    <View>{this.linkItem('Contact Sales', 'https://www.compdf.com/contact-sales')}</View>
                    <View>{this.linkItem('support@compdf.com', 'mailto:support@compdf.com?subject=Technical Support')}</View>
                </View>
                <View style={styles.copyRightContainer}>
                    <Text style={styles.copyRightText}>© 2014-2025 PDF Technologies, Inc. All Rights Reserved.</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => {
                            Linking.openURL('https://www.compdf.com/privacy-policy')
                        }}>
                            <Text style={styles.copyRightText_1}>Privacy Policy</Text>
                        </TouchableOpacity>

                        <Text style={styles.copyRightText_1}>   |   </Text>
                        <TouchableOpacity onPress={() => {
                            Linking.openURL('https://www.compdf.com/terms-of-service')
                        }}>
                            <Text style={styles.copyRightText_1}>Terms of Service</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    linkItem = (title: string, url: string) => {
        return (
            <TouchableOpacity onPress={async () => {
                const supported = await Linking.canOpenURL(url)
                if (supported) {
                    await Linking.openURL(url)
                } else {
                    console.log(`Don't know how to open this URL: ${url}`);
                }
            }}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoItemText}>{title}</Text>
                    <Image source={require('../../assets/arrow_right.png')} style={{ width: 24, height: 24 }} />
                </View>
            </TouchableOpacity>
        );
    };
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#F2F2F2',
        paddingVertical: 6,
        paddingHorizontal: 16
    },
    headerText: {
        fontSize: 12,
        color: '#42464D'
    },
    container: {
        backgroundColor: '#FFF',
        flex: 1
    },
    infoItem: {
        paddingHorizontal: 16,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#0000001A'
    },
    infoItemText: {
        color: '#42464D',
        fontSize: 14
    },
    copyRightContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 16
    },
    copyRightText: {
        color: '#42464D',
        fontSize: 11,
        textAlign: 'center'
    },
    copyRightText_1: {
        fontSize: 11,
        color: '#1460F3'
    }
});

export default SettingScreen;