// app/Components/GroupIcon.js
import React from 'react';
import { StyleSheet, View, Image} from 'react-native'
import ImagesGroup from '../modules/ImageGroup';

export default class GroupIcon extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Image style={styles.groupPic} source={ImagesGroup[this.props.idImage]} />
        )
    }
}

const styles = StyleSheet.create({
    groupPic: {
        marginTop: 5,
        alignSelf: 'center',
        resizeMode: 'contain',
        width: 120,
        height: 120,
        borderColor: '#ffb4e2',
        borderWidth: 3,
        borderRadius: 60,
        marginBottom: 10
      },
});