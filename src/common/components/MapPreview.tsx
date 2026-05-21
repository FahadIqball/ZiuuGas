import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
// @ts-ignore
import MapView, { Marker, Circle } from 'react-native-maps';
import { colors } from '../../enums/colors';
import { hp, spacing } from '../../enums/spacing';

interface MapPreviewProps {
  radiusInKm: number;
}

export const MapPreview: React.FC<MapPreviewProps> = ({ radiusInKm }) => {
  // Default coordinates (e.g., Paris as seen in the mockup)
  const initialRegion = {
    latitude: 48.8584,
    longitude: 2.2945,
    latitudeDelta: 0.0922 * (radiusInKm / 5), // Adjust zoom based on radius
    longitudeDelta: 0.0421 * (radiusInKm / 5),
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        scrollEnabled={false} // Disable interaction for preview
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude: 48.8584, longitude: 2.2945 }} />
        <Circle
          center={{ latitude: 48.8584, longitude: 2.2945 }}
          radius={radiusInKm * 1000} // Convert km to meters
          strokeColor={colors.primary}
          fillColor={`${colors.primary}33`} // 20% opacity
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(25),
    width: '100%',
    borderRadius: spacing.m,
    overflow: 'hidden',
    marginTop: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
});
