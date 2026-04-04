import { useState } from "react";
import { View, Text, type ViewStyle, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { AnimatedButton } from "./AnimatedButton";
import { FadeInView } from "./FadeInView";
import { FormTextInput } from "./FormTextInput";

export interface PremiumLoginScreenProps {
  /** Product name displayed at the top */
  productName?: string;
  /** Short initials shown as logo placeholder (e.g. "EOE", "ED") */
  logoInitials?: string;
  /** App title displayed below the logo */
  title?: string;
  /** Subtitle / tagline below the title */
  subtitle?: string;
  /** Primary button label */
  loginLabel?: string;
  /** Called when user submits email + password */
  onLogin?: (email: string, password: string) => Promise<void>;
  /** Secondary action label (e.g. "Sign Up") */
  secondaryLabel?: string;
  /** Called when user taps the secondary action */
  onSecondary?: () => void;
  /** Sign-up handler (shows "Create Account" link) */
  onSignUp?: () => void;
  /** Brand accent color */
  accentColor?: string;
  /** Dark mode */
  dark?: boolean;
  /** Container style override */
  style?: ViewStyle;
}

/**
 * A premium-styled login screen with email/password form and fade-in animation.
 *
 * ```tsx
 * <PremiumLoginScreen
 *   productName="Empire Digital"
 *   logoInitials="ED"
 *   onLogin={async (email, password) => { await login(email, password); }}
 *   onSignUp={() => router.push("/register")}
 * />
 * ```
 */
export function PremiumLoginScreen({
  productName,
  logoInitials,
  title,
  subtitle,
  loginLabel = "Log In",
  onLogin,
  secondaryLabel,
  onSecondary,
  onSignUp,
  accentColor = "#2563eb",
  dark = false,
  style,
}: PremiumLoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";
  const bgColor = dark ? "#111827" : "#ffffff";

  const displayTitle = title ?? (productName ? `Welcome to ${productName}` : "Welcome");

  async function handleLogin() {
    if (!onLogin) return;
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bgColor }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <FadeInView
          delay={100}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
            paddingVertical: 48,
            ...style,
          }}
        >
          {/* Logo initials */}
          {logoInitials && (
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: accentColor,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#ffffff",
                  letterSpacing: 1,
                }}
              >
                {logoInitials}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: textColor,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {displayTitle}
          </Text>

          {/* Subtitle */}
          {subtitle && (
            <Text
              style={{
                fontSize: 16,
                color: mutedColor,
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              {subtitle}
            </Text>
          )}

          {/* Form */}
          <View style={{ width: "100%", maxWidth: 360, marginTop: 24 }}>
            <FormTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
            />

            <FormTextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            {/* Error message */}
            {error !== "" && (
              <Text
                style={{
                  color: "#dc2626",
                  fontSize: 14,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {error}
              </Text>
            )}

            {/* Login button */}
            {onLogin && (
              <AnimatedButton
                label={loginLabel}
                loadingLabel="Signing in..."
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={{
                  backgroundColor: accentColor,
                  marginBottom: secondaryLabel || onSignUp ? 12 : 0,
                }}
              />
            )}

            {/* Secondary action */}
            {secondaryLabel && onSecondary && (
              <AnimatedButton
                label={secondaryLabel}
                onPress={onSecondary}
                variant="outline"
              />
            )}

            {/* Sign up link */}
            {onSignUp && !secondaryLabel && (
              <AnimatedButton
                label="Create Account"
                onPress={onSignUp}
                variant="outline"
              />
            )}
          </View>
        </FadeInView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
