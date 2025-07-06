import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

const ResponsiveContainer = ({ children, style, padding = true }) => {
  const { width, height } = useWindowDimensions();
  
  // Determine if device is tablet based on width
  const isTablet = width >= 768;
  const isLargeScreen = width >= 1024;
  
  const containerStyle = [
    styles.container,
    {
      paddingHorizontal: padding ? (isLargeScreen ? 40 : isTablet ? 32 : 20) : 0,
      paddingVertical: padding ? (isLargeScreen ? 24 : isTablet ? 20 : 16) : 0,
      maxWidth: isLargeScreen ? 1200 : isTablet ? 900 : '100%',
    },
    style
  ];

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
  },
});

export default ResponsiveContainer; 