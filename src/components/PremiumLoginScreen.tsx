import React, { useRef, useEffect, useState, useCallback, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  type ViewStyle,
  type TextInputProps,
} from "react-native";
import { recruitmentTheme, recruitmentMarketingLinkOnDark } from "../lib/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tapMedium } from "../lib/haptics";

// ── Types ────────────────────────────────────────────────────────────────

export interface PremiumLoginScreenProps {
  /** Product display name (e.g. "Empire Digital") */
  productName: string;
  /** Subtitle below product name (e.g. "Staff Portal") */
  subtitle?: string;
  /** Product accent color — used for button and highlights */
  accentColor: string;
  /** Light (white) or dark (default) shell */
  appearance?: "dark" | "light";
  /** Initials shown in the logo badge (e.g. "ED", "ER") */
  logoInitials: string;
  /** Async login handler — throw on failure */
  onLogin: (email: string, password: string) => Promise<void>;
  /** Optional sign-up press handler — shows link when provided */
  onSignUp?: () => void;
  /** Optional forgot password handler */
  onForgotPassword?: () => void;
  /** Override container style */
  style?: ViewStyle;
  /**
   * Apple-style black hero band with split brand (prefix white + accent word in `#2997ff`).
   * Only applies when `appearance` is `"light"`.
   */
  marketingBrand?: { prefix: string; accent: string };
}

// ── Dark Input ───────────────────────────────────────────────────────────

const ThemedInput = forwardRef<
  React.ComponentRef<typeof TextInput>,
  {
    label: string;
    error?: string;
    accentColor: string;
    appearance: "dark" | "light";
  } & TextInputProps
>(function ThemedInput(
  { label, error, accentColor, appearance, ...inputProps },
  ref
) {
  const [focused, setFocused] = useState(false);
  const isLight = appearance === "light";
  const labelStyle = isLight ? sLight.inputLabel : s.inputLabel;
  const wrapperBase = isLight ? sLight.inputWrapper : s.inputWrapper;
  const inputStyle = isLight ? sLight.input : s.input;
  const errStyle = isLight ? sLight.inputError : s.inputError;

  return (
    <View style={s.inputGroup}>
      <Text style={labelStyle}>{label}</Text>
      <View
        style={[
          wrapperBase,
          focused && { borderColor: accentColor },
          !!error && (isLight ? sLight.inputWrapperError : s.inputWrapperError),
        ]}
      >
        <TextInput
          ref={ref}
          style={inputStyle}
          placeholderTextColor={isLight ? recruitmentTheme.textPlaceholder : "#4b5563"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />
      </View>
      {!!error && <Text style={errStyle}>{error}</Text>}
    </View>
  );
});

// ── Main Component ───────────────────────────────────────────────────────

export function PremiumLoginScreen({
  productName,
  subtitle,
  accentColor,
  appearance = "dark",
  logoInitials,
  onLogin,
  onSignUp,
  onForgotPassword,
  style,
  marketingBrand,
}: PremiumLoginScreenProps) {
  const insets = useSafeAreaInsets();
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validate = useCallback(() => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Enter a valid email");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    return valid;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (loading) return;
    tapMedium();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 429) {
        setError("Too many attempts. Please wait and try again.");
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, loading, onLogin, validate]);

  const handlePressIn = useCallback(() => {
    if (loading) return;
    Animated.timing(buttonScale, {
      toValue: 0.96,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }, [buttonScale, loading]);

  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [buttonScale]);

  const isLight = appearance === "light";
  const glowShadowColor = isLight ? "rgba(0,0,0,0.06)" : accentColor + "40";
  const shell = isLight ? sLight : s;
  const showMarketingHero = Boolean(isLight && marketingBrand);

  return (
    <KeyboardAvoidingView
      style={[
        showMarketingHero ? { flex: 1, backgroundColor: recruitmentTheme.background } : shell.screen,
        style,
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={
          showMarketingHero
            ? { flexGrow: 1, paddingBottom: 40 }
            : shell.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {showMarketingHero && (
          <View
            style={{
              backgroundColor: "#000000",
              paddingTop: insets.top + 20,
              paddingBottom: 28,
              paddingHorizontal: 24,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "700", letterSpacing: -0.3 }}>
              <Text style={{ color: "#ffffff" }}>{marketingBrand!.prefix}</Text>
              <Text style={{ color: recruitmentMarketingLinkOnDark }}>{marketingBrand!.accent}</Text>
            </Text>
            {subtitle ? (
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  fontWeight: "500",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        )}
        <Animated.View
          style={[
            shell.container,
            showMarketingHero ? { paddingHorizontal: 24, paddingTop: 8 } : {},
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo Badge */}
          {!showMarketingHero && (
            <Animated.View
              style={[
                shell.logoBadge,
                {
                  backgroundColor: accentColor,
                  transform: [{ scale: logoScale }],
                  shadowColor: accentColor,
                },
              ]}
            >
              <Text style={shell.logoText}>{logoInitials}</Text>
            </Animated.View>
          )}

          {/* Title */}
          {!showMarketingHero && (
            <>
              <Text style={shell.title}>{productName}</Text>
              {subtitle && <Text style={shell.subtitle}>{subtitle}</Text>}
            </>
          )}
          <Text style={[shell.welcomeText, showMarketingHero && { marginTop: 24, marginBottom: 20 }]}>
            Sign in to continue
          </Text>

          {/* Card */}
          <View
            style={[
              shell.card,
              {
                shadowColor: glowShadowColor,
              },
            ]}
          >
            {/* Error banner */}
            {!!error && (
              <View style={isLight ? sLight.errorBanner : s.errorBanner}>
                <Text style={isLight ? sLight.errorBannerText : s.errorBannerText}>{error}</Text>
              </View>
            )}

            <ThemedInput
              label="Email"
              placeholder="you@company.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setEmailError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              error={emailError}
              accentColor={accentColor}
              appearance={appearance}
              accessibilityLabel="Email address"
            />

            <ThemedInput
              ref={passwordRef}
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setPasswordError("");
              }}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              error={passwordError}
              accentColor={accentColor}
              appearance={appearance}
              accessibilityLabel="Password"
            />

            {onForgotPassword && (
              <Pressable
                onPress={onForgotPassword}
                style={shell.forgotPasswordBtn}
              >
                <Text style={shell.forgotPasswordText}>Forgot password?</Text>
              </Pressable>
            )}

            {/* Sign In Button */}
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleLogin}
              disabled={loading}
              accessibilityLabel="Sign in"
              accessibilityRole="button"
            >
              <Animated.View
                style={[
                  shell.button,
                  {
                    backgroundColor: accentColor,
                    opacity: loading ? 0.6 : 1,
                    transform: [{ scale: buttonScale }],
                  },
                ]}
              >
                {loading && (
                  <ActivityIndicator
                    color="#fff"
                    size="small"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text style={shell.buttonText}>
                  {loading ? "Signing in..." : "Sign in"}
                </Text>
              </Animated.View>
            </Pressable>
          </View>

          {/* Sign up link */}
          {onSignUp && (
            <View style={shell.signUpRow}>
              <Text style={shell.signUpLabel}>No account? </Text>
              <Pressable onPress={onSignUp}>
                <Text style={[shell.signUpLink, { color: accentColor }]}>
                  Create one
                </Text>
              </Pressable>
            </View>
          )}

          {/* Bottom branding */}
          <Text style={shell.brandingText}>Powered by EmpireO.AI</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#080810",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  container: {
    alignItems: "center",
  },

  // Logo
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },

  // Title
  title: {
    color: "#f9fafb",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
  welcomeText: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
  },

  // Card
  card: {
    width: "100%",
    backgroundColor: "#111118",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1e1e2a",
    padding: 24,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },

  // Error
  errorBanner: {
    backgroundColor: "rgba(220, 38, 38, 0.12)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.25)",
  },
  errorBannerText: {
    color: "#f87171",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },

  // Inputs
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    color: "#d1d5db",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  inputWrapper: {
    backgroundColor: "#0d0d14",
    borderWidth: 1,
    borderColor: "#1e1e2a",
    borderRadius: 14,
  },
  inputWrapperError: {
    borderColor: "rgba(220, 38, 38, 0.6)",
  },
  input: {
    color: "#f9fafb",
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 15 : 12,
  },
  inputError: {
    color: "#f87171",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 2,
  },

  // Forgot password
  forgotPasswordBtn: {
    alignSelf: "flex-end",
    marginBottom: 8,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#6b7280",
    fontSize: 13,
  },

  // Button
  button: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Sign up
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signUpLabel: {
    color: "#6b7280",
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Branding
  brandingText: {
    color: "#374151",
    fontSize: 11,
    textAlign: "center",
    marginTop: 32,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});

const rt = recruitmentTheme;

const sLight = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: rt.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  container: {
    alignItems: "center",
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  logoText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: {
    color: rt.text,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  subtitle: {
    color: rt.textMuted,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 4,
  },
  welcomeText: {
    color: rt.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
  },
  card: {
    width: "100%",
    backgroundColor: rt.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: rt.cardBorder,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 3,
  },
  errorBanner: {
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.2)",
  },
  errorBannerText: {
    color: "#b91c1c",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  inputLabel: {
    color: rt.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  inputWrapper: {
    backgroundColor: rt.card,
    borderWidth: 1,
    borderColor: rt.inputBorder,
    borderRadius: 14,
  },
  inputWrapperError: {
    borderColor: "rgba(220, 38, 38, 0.6)",
  },
  input: {
    color: rt.text,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 15 : 12,
  },
  inputError: {
    color: "#b91c1c",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 2,
  },
  forgotPasswordBtn: {
    alignSelf: "flex-end",
    marginBottom: 8,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#666666",
    fontSize: 13,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signUpLabel: {
    color: rt.textMuted,
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  brandingText: {
    color: rt.textPlaceholder,
    fontSize: 11,
    textAlign: "center",
    marginTop: 32,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
