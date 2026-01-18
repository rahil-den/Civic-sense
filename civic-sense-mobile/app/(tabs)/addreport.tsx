import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Addreport = () => {
  return (
    <View 
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.text}>On Clicking of Add Report the camera will open then there will be a form to fill</Text>
    </View>
  )
}

export default Addreport

const styles = StyleSheet.create({
    text:{
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        
    }
})