import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  accentColor?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  retryCount: number;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, retryCount: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    if (__DEV__) {
      console.error("[ErrorBoundary]", error, errorInfo.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      const accent = this.props.accentColor ?? "#2563eb";
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f9fafb",
            padding: 24,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: "#374151",
              textAlign: "center",
            }}
          >
            {this.props.fallbackTitle ?? "Something went wrong."}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#9ca3af",
              marginTop: 4,
              textAlign: "center",
            }}
          >
            {this.props.fallbackMessage ?? "Please try again."}
          </Text>
          <TouchableOpacity
            onPress={() =>
              this.setState((s) => ({
                hasError: false,
                retryCount: s.retryCount + 1,
              }))
            }
            style={{
              marginTop: 16,
              backgroundColor: accent,
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View key={this.state.retryCount} style={{ flex: 1 }}>
        {this.props.children}
      </View>
    );
  }
}
