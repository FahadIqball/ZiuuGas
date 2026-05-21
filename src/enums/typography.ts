export const FONT = {
  bold: 'Poppins-Bold',
  regular: 'Poppins-Regular',
  extraBold: 'Poppins-ExtraBold',
  semiBold: 'Poppins-SemiBold',
  medium: 'Poppins-Medium',
}

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 20,
    fontFamily: FONT.semiBold,
  },
  h3: {
    fontSize: 16,
    fontFamily: FONT.semiBold,
  },
  body: {
    fontSize: 14,
    fontFamily: FONT.medium,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: FONT.regular,
  },
  button: {
    // fontSize: 16,
    fontFamily: FONT.semiBold,
  },
  kg: {
    fontSize: 12,
    fontFamily: FONT.medium,
  },
  weight: {
    fontSize: 12,
    fontFamily: FONT.regular,
  },
  product: {
    fontSize: 10,
    fontFamily: FONT.medium,
  },
  category: {
    fontSize: 16,
    fontFamily: FONT.medium,
  },
  select: {
    fontSize: 14,
    fontFamily: FONT.medium,
  }
};
