import { useMemo } from "react";
import { View, Text, type TextStyle, type ViewStyle } from "react-native";

export interface RichTextDisplayProps {
  /** Markdown-like content string */
  content: string;
  /** Base text style */
  style?: TextStyle;
  /** Container style */
  containerStyle?: ViewStyle;
  /** Dark mode */
  dark?: boolean;
  /** Link color (default #2563eb) */
  linkColor?: string;
}

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "bullet"; text: string }
  | { type: "paragraph"; text: string };

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Headings
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      blocks.push({ type: "heading", level: headingMatch[1]!.length, text: headingMatch[2]! });
      continue;
    }

    // Bullets
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({ type: "bullet", text: trimmed.slice(2) });
      continue;
    }

    blocks.push({ type: "paragraph", text: trimmed });
  }

  return blocks;
}

/** Parse inline formatting: **bold**, *italic*, [text](url) */
function renderInline(
  text: string,
  baseStyle: TextStyle,
  linkColor: string,
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Regex: **bold**, *italic*, [link](url)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIdx) {
      parts.push(
        <Text key={key++} style={baseStyle}>
          {text.slice(lastIdx, match.index)}
        </Text>,
      );
    }

    if (match[2]) {
      // Bold
      parts.push(
        <Text key={key++} style={[baseStyle, { fontWeight: "700" }]}>
          {match[2]}
        </Text>,
      );
    } else if (match[3]) {
      // Italic
      parts.push(
        <Text key={key++} style={[baseStyle, { fontStyle: "italic" }]}>
          {match[3]}
        </Text>,
      );
    } else if (match[4] && match[5]) {
      // Link — rendered as colored text (no Linking in display-only)
      parts.push(
        <Text key={key++} style={[baseStyle, { color: linkColor, textDecorationLine: "underline" }]}>
          {match[4]}
        </Text>,
      );
    }

    lastIdx = match.index + match[0].length;
  }

  // Remaining text
  if (lastIdx < text.length) {
    parts.push(
      <Text key={key++} style={baseStyle}>
        {text.slice(lastIdx)}
      </Text>,
    );
  }

  return parts.length > 0 ? parts : [<Text key={0} style={baseStyle}>{text}</Text>];
}

/**
 * Renders basic markdown-like formatted text (display-only, not an editor).
 * Supports: **bold**, *italic*, [links](url), # headings, bullet lists.
 *
 * ```tsx
 * <RichTextDisplay content="# Welcome\n\nThis is **bold** and *italic* text." />
 * ```
 */
export function RichTextDisplay({
  content,
  style,
  containerStyle,
  dark = false,
  linkColor = "#2563eb",
}: RichTextDisplayProps) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  const textColor = dark ? "#f9fafb" : "#111827";
  const mutedColor = dark ? "#9ca3af" : "#6b7280";

  const baseStyle: TextStyle = {
    fontSize: 14,
    color: textColor,
    lineHeight: 21,
    ...style,
  };

  const headingSizes: Record<number, number> = { 1: 22, 2: 18, 3: 15 };

  return (
    <View style={containerStyle}>
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return (
            <Text
              key={idx}
              style={[
                baseStyle,
                {
                  fontSize: headingSizes[block.level] ?? 15,
                  fontWeight: "700",
                  marginTop: idx > 0 ? 12 : 0,
                  marginBottom: 4,
                },
              ]}
            >
              {block.text}
            </Text>
          );
        }

        if (block.type === "bullet") {
          return (
            <View key={idx} style={{ flexDirection: "row", marginTop: 4, paddingLeft: 4 }}>
              <Text style={[baseStyle, { color: mutedColor, marginRight: 8 }]}>{"\u2022"}</Text>
              <Text style={[baseStyle, { flex: 1 }]}>
                {renderInline(block.text, baseStyle, linkColor)}
              </Text>
            </View>
          );
        }

        return (
          <Text key={idx} style={[baseStyle, { marginTop: idx > 0 ? 8 : 0 }]}>
            {renderInline(block.text, baseStyle, linkColor)}
          </Text>
        );
      })}
    </View>
  );
}
