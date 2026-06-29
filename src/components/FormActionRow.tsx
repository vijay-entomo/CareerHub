import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import { Button } from "./Button";

interface FormActionRowProps {
  onCancel: () => void;
  onSave: () => void;
  cancelText?: string;
  saveText?: string;
}

export const FormActionRow = ({
  onCancel,
  onSave,
  cancelText = "Cancel",
  saveText = "Save",
}: FormActionRowProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Button
        title={cancelText}
        onPress={onCancel}
        variant="secondary"
        style={styles.button}
        textStyle={styles.cancelText}
      />
      <Button
        title={saveText}
        onPress={onSave}
        variant="primary"
        style={styles.button}
      />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
      // marginTop: 16,
    },
    button: {
      flex: 1, // Buttons share the row equally
      width: "auto", // Override the 100% width default of Button
    },
    cancelText: {
      color: theme.textSecondary,
    },
  });
