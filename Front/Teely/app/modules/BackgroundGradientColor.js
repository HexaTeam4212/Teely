import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

function backgroundGradientColor() {
    return (
        <LinearGradient colors={['#d6fffd','#78e1db']}
          start={[1,1]}
          end={[1,0.2]}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: "100%",
          }}
          />
    )
}

export {backgroundGradientColor}