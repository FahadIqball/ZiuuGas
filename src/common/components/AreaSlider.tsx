import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// @ts-ignore
import { Slider } from '@miblanchard/react-native-slider';
import { colors } from '../../enums/colors';
import { hp, spacing } from '../../enums/spacing';
import { FONT } from '../../enums/typography';
import { useTranslation } from '../../hooks/useTranslation';
import { Addresses } from '../../assets/svgs';

interface AreaSliderProps {
  value: number;
  onValueChange: (value: number | number[]) => void;
  disabled?: boolean;
}

export const AreaSlider: React.FC<AreaSliderProps> = ({ value, onValueChange, disabled }) => {
  const steps = [1, 5, 10, 15, 20, 25, 30];
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={1}
        maximumValue={30}
        step={1}
        disabled={disabled}
        minimumTrackTintColor={colors.lightBlue}
        maximumTrackTintColor={colors.lightBlue}
        trackStyle={styles.track}
        renderThumbComponent={() => (
          <View style={styles.thumbContainer}>
            <Addresses width={spacing.xl} height={spacing.xl} />
          </View>
        )}
      />
      <View style={styles.labelsContainer}>
        {steps.map((step) => (
          <Text key={step} style={styles.labelText}>
            {step} {t('km')}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.s,
  },
  track: {
    height: hp(0.8),
    borderRadius: spacing.xs,
  },
  thumbContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // Small offset for vertical centering relative to the thick track
    marginTop: spacing.xs / 2,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginTop: spacing.s,
  },
  labelText: {
    color: colors.secondary,
    fontSize: 10,
    fontFamily: FONT.regular,
  },
});
