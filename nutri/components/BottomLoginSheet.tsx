import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette } from '@/constants/Colors';
import { Link } from 'expo-router';

const BottomLoginSheet = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <Link
        href={{
          pathname: '/login',
          params: {
            type: 'register',
          },
        }}
        asChild
      >
        <TouchableOpacity style={[defaultStyles.btn, styles.btnDark]}>
          <Ionicons name="mail" size={20} style={styles.btnIcon} color={ColorPalette.light} />
          <Text style={styles.btnDarkText}>Continue with Email</Text>
        </TouchableOpacity>
      </Link>

      <Link
        href={{
          pathname: '/login',
          params: {
            type: 'login',
          },
        }}
        asChild
      >
        <TouchableOpacity style={[defaultStyles.btn, styles.btnDark]}>
          <Text style={styles.btnDarkText}>Log in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    padding: 26,
    gap: 14,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  btnIcon: {
    paddingRight: 7,
  },
  btnDark: {
    backgroundColor: ColorPalette.grey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
  },
  btnDarkText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default BottomLoginSheet;
