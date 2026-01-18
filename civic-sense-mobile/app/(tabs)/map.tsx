import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Map = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Text style={styles.text}>The Map Screen will be added soon</Text>
    </View>
  )
}

export default Map

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    }
})