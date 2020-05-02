// app/Components/ProfileIcon.js
import React from 'react';
import { StyleSheet, View, Image} from 'react-native'
import ImagesProfile from '../modules/ImageProfile';

export default class ProfileIcon extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.icon_container}>
                <Image style={styles.profile} source={ImagesProfile[this.props.idImage]} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    icon_container: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    profile: {
        resizeMode: 'contain',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderColor: '#ffb4e2',
        borderWidth: 3,
        borderRadius: 60,
        margin: 10
    },
});