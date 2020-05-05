import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

function backgroundGradientColor() {
    return (
        <LinearGradient colors={['rgba(255,255,255,0)','#78e1db']}
          start={[1,1]}
          end={[1,0.4]}
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