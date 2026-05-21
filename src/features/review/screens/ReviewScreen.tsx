import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { ScreenHeader } from '../../../common/components/ScreenHeader'
import { useTranslation } from '../../../hooks/useTranslation'
import { useTheme } from '../../../hooks/useTheme'
import { useStyles } from '../../../hooks/useStyles'
import { ThemeColors } from '../../../enums/colors'
import { hp, wp } from '../../../enums/spacing'
import { SVG } from '../../../assets'
import { Rating } from 'react-native-ratings'
import { AppText } from '../../../common/components/Typography/Typography'
import { Input } from '../../../common/components/Input'
import { Button } from '../../../common/components/Button'
import { FONT } from '../../../enums/typography'
import { reviewRepository } from '../../../services/reviewService'
import { useAuth } from '../../../context/AuthContext'

const ReviewScreen = ({ route, navigation }: any) => {
    const { colors } = useTheme();
    const styles = useStyles(createStyles);
    const { t } = useTranslation();
    const { user } = useAuth();
    const { sellerId, productId, orderId } = route.params || {};

    const [rating, setRating] = useState(3);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!user) return;
        if (!comment.trim()) {
            Alert.alert(t('Error'), t('fill_all_fields'));
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewRepository.addReview({
                userId: user.uid,
                userName: user.displayName || t('user'),
                userAvatar: user.photoURL || '',
                rating,
                comment,
                sellerId,
                productId,
                orderId,
            });

            Alert.alert(t('Success'), t('review_submitted_success'), [
                { text: t('OK'), onPress: () => navigation.goBack() }
            ]);
        } catch (err) {
            console.error('Failed to submit review:', err);
            Alert.alert(t('Error'), t('failed_to_submit_review'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScreenHeader
                showBackButton={true}
            />
            <View style={styles.content}>
                <View style={styles.mainContainer}>
                    <SVG.Thumbsup style={styles.thumbsup} />
                    <AppText style={styles.title}>{t('experience')}</AppText>
                    <Rating
                        type='star'
                        ratingCount={5}
                        startingValue={rating}
                        onFinishRating={setRating}
                        imageSize={40}
                        showRating={false}
                        tintColor={colors.background}
                        style={styles.rating}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <Input
                        placeholder={t('writeReview')}
                        placeholderTextColor={colors.inputPlaceholder}
                        style={styles.input}
                        inputContainerStyle={styles.inputContainer}
                        value={comment}
                        onChangeText={setComment}
                        multiline
                    />
                    <Button
                        title={t('submit')}
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <ActivityIndicator color={colors.white} />}
                    </Button>
                </View>
            </View>
        </View>
    )
}

export default ReviewScreen

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: wp(6),
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        color: colors.secondary,
        fontFamily: FONT.medium,
    },
    thumbsup: {
        marginBottom: hp(3),
        width: 50,
        height: 50,
    },
    rating: {
        paddingVertical: hp(2),
    },
    bottomContainer: {
        backgroundColor: colors.background,
        marginBottom: hp(3)
    },
    button: {
        height: hp(6)
    },
    input: {
        fontSize: 14,
        fontFamily: FONT.regular,
    },
    inputContainer: {
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        minHeight: hp(6),
        paddingHorizontal: wp(2)
    }
})