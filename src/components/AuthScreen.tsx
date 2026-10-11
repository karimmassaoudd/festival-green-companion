import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopNotificationBar } from '@/components/TopNotificationBar';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { colors } from '@/utils/theme';

type AuthScreenProps = {
  mode: 'login' | 'sign-up';
};

export function AuthScreen({ mode }: AuthScreenProps) {
  const { colors } = useAppTheme();
  const isSignUp = mode === 'sign-up';
  const { signIn, signUp, startupError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(startupError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  async function submit() {
    setError(null);

    if (isSignUp && !fullName.trim()) {
      setError('Enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = isSignUp
      ? await signUp(fullName, email, password)
      : await signIn(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      Alert.alert(
        'Check your email',
        'Your account was created. Open the confirmation email, then return and log in.',
        [{ text: 'Go to login', onPress: () => router.replace('/login' as Href) }],
      );
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          ref={scrollRef}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.page, { backgroundColor: colors.surface }]}>
            <TopNotificationBar message="Festival travel updates" />
            <View style={styles.brandRow}>
              <View style={[styles.logoTile, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name="leaf-outline" size={25} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.brand, { color: colors.text }]}>Greenfield Festival</Text>
                <Text style={[styles.brandMeta, { color: colors.textMuted }]}>Travel planner</Text>
              </View>
            </View>

            <View style={styles.intro}>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>{isSignUp ? 'Create your account' : 'Welcome back'}</Text>
              <Text style={[styles.title, { color: colors.text }]}>{isSignUp ? 'Sign up' : 'Log in'}</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                {isSignUp
                  ? 'Save your festival travel choice securely to your account.'
                  : 'Log in to load your saved festival travel choice.'}
              </Text>
            </View>

            <View style={[styles.formCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              {isSignUp ? (
                <AuthInput
                  label="Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Your name"
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              ) : null}

              <AuthInput
                label="Email"
                inputRef={emailRef}
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <AuthInput
                label="Password"
                inputRef={passwordRef}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                secureTextEntry
                autoCapitalize="none"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                textContentType={isSignUp ? 'newPassword' : 'password'}
                returnKeyType={isSignUp ? 'next' : 'done'}
                blurOnSubmit={!isSignUp}
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                onSubmitEditing={() => {
                  if (isSignUp) {
                    confirmPasswordRef.current?.focus();
                  } else {
                    void submit();
                  }
                }}
              />

              {isSignUp ? (
                <AuthInput
                  label="Confirm password"
                  inputRef={confirmPasswordRef}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Type your password again"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
                  onSubmitEditing={() => void submit()}
                />
              ) : null}

              {error ? (
                <View style={[styles.errorCard, { backgroundColor: colors.surfaceMuted }]}>
                  <Ionicons name="alert-circle-outline" size={19} color={colors.danger} />
                  <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={() => void submit()}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: colors.primary },
                  isSubmitting && styles.buttonDisabled,
                  pressed && styles.pressed,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>{isSignUp ? 'Create account' : 'Log in'}</Text>
                )}
              </Pressable>
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchCopy, { color: colors.textMuted }]}>
                {isSignUp ? 'Already have an account?' : 'New to Greenfield Festival?'}
              </Text>
              <Pressable
                accessibilityRole="link"
                onPress={() => router.replace((isSignUp ? '/login' : '/sign-up') as Href)}
                hitSlop={8}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <Text style={[styles.switchLink, { color: colors.primary }]}>{isSignUp ? 'Log in' : 'Sign up'}</Text>
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.push('/privacy' as Href)}
              style={({ pressed }) => [styles.privacyLink, pressed && styles.pressed]}
            >
              <Ionicons name="shield-checkmark-outline" size={15} color={colors.primary} />
              <Text style={[styles.privacyText, { color: colors.primary }]}>Privacy policy</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthInputProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  inputRef?: React.RefObject<TextInput | null>;
};

function AuthInput({ label, inputRef, ...props }: AuthInputProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        ref={inputRef}
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surfaceMuted }]}
      />
    </View>
  );
}

const palette = {
  ink: '#182033',
  muted: '#60708A',
  line: '#E2E7EE',
  soft: '#F6F8FA',
  green: '#34815F',
  greenSoft: '#E8F3ED',
  danger: '#9B3A35',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  page: {
    width: '100%',
    maxWidth: 440,
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: colors.surface,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 26 },
  logoTile: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: palette.greenSoft,
  },
  brand: { color: palette.ink, fontSize: 17, fontWeight: '700' },
  brandMeta: { marginTop: 3, color: palette.muted, fontSize: 12 },
  intro: { paddingTop: 48 },
  eyebrow: { color: palette.green, fontSize: 13, fontWeight: '700' },
  title: { marginTop: 8, color: palette.ink, fontSize: 34, lineHeight: 40, fontWeight: '800' },
  subtitle: { marginTop: 9, color: '#4D5D75', fontSize: 15, lineHeight: 22 },
  formCard: {
    gap: 17,
    marginTop: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  field: { gap: 7 },
  label: { color: palette.ink, fontSize: 12, fontWeight: '700' },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#D6DDE7',
    borderRadius: 8,
    color: palette.ink,
    backgroundColor: palette.soft,
    fontSize: 15,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: 11,
    borderRadius: 7,
    backgroundColor: '#FFF3F2',
  },
  errorText: { flex: 1, color: '#7D2F2A', fontSize: 11, lineHeight: 16 },
  primaryButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: palette.green,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  buttonDisabled: { opacity: 0.65 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 },
  switchCopy: { color: palette.muted, fontSize: 13 },
  switchLink: { color: palette.green, fontSize: 13, fontWeight: '700' },
  privacyLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 },
  privacyText: { fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
