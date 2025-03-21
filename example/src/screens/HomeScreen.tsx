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
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import {examples} from "../examples";

type Props = {
  navigation: any; 
};

class HomeScreen extends Component<Props> {

  state = {
    isFocused: false,
  };
  focusListener: any;
  blurListener: any;

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({ isFocused: true });
    });

    this.blurListener = this.props.navigation.addListener('blur', () => {
      this.setState({ isFocused: false });
    });
  }

  componentWillUnmount() {
    if (this.focusListener) this.focusListener();
    if (this.blurListener) this.blurListener();
  }

  render() {
    return (
        <View style={styles.container}>
          <FlatList
            data={examples}
            renderItem={this._renderItem}
            keyExtractor={item => item.key}
          />
      </View>
    );
  }

  _renderItem = ({ item }) => {
    if(item.type === 'header'){
      return (<Text style={{ fontSize: 16, fontWeight: '500', color:'#000', marginTop : 8 }}>{item.title}</Text>)
    } else {
      return (
        <TouchableOpacity
          style={styles.funItem} onPress={() => {
            if(Platform.OS == 'android'){
              if (this.state.isFocused) {
                item.action(this);
              }
            }else{
              item.action(this);
            }
          }}>
          <Image source={require('../../assets/view.png')} style={styles.itemIcon} />
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
          <Image source={require('../../assets/arrow_right.png')} style={styles.itemTailIcon} />
  
        </TouchableOpacity>
      );
    }
  }

}


const styles = StyleSheet.create({
  mediumTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  funItem: {
    height: 56,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4
  },
  itemIcon: {
    width: 32,
    height: 32,
    marginRight: 16
  },
  itemTailIcon: {
    width: 24,
    height: 24
  },
  itemTitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemDescription: {
    fontSize: 11,
    color: '#000',
    opacity: 0.6
  },
  body2: {
    textAlign: 'center',
    fontSize: 12,
    color: '#000'
  },
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    flex: 1,
  }
});


export default HomeScreen;