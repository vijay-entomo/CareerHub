import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, TouchableOpacity, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView, AnimatePresence } from 'moti';
import { X } from 'lucide-react-native';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function BottomSheetModal({ visible, onClose, children, containerStyle }: BottomSheetModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
    } else {
      // Delay unmounting the Modal so AnimatePresence can run exit animations
      const timer = setTimeout(() => {
        setInternalVisible(false);
      }, 600); // Wait for the 500ms animation to complete
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal
      visible={internalVisible}
      animationType="none" // Disable native animation so Moti handles it
      transparent={true}
      onRequestClose={onClose}
    >
      <AnimatePresence>
        {visible && (
          <View style={styles.modalOverlay}>
            {/* Safe, guaranteed dark backdrop */}
            <MotiView 
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 500 }}
              style={StyleSheet.absoluteFill}
            >
              <Pressable 
                style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} 
                onPress={onClose} 
              />
            </MotiView>

            <MotiView
              from={{ translateY: 800 }}
              animate={{ translateY: 0 }}
              exit={{ translateY: 800 }}
              transition={{ type: "timing", duration: 500, easing: (t) => 1 - Math.pow(1 - t, 4) }}
              style={styles.sheetWrapper}
            >
              {/* Close Button Above Modal */}
              <View style={styles.closeButtonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.closeButton, 
                    { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }
                  ]} 
                  onPress={onClose}
                >
                  <X size={20} color={theme.text} />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.modalContent,
                  { 
                    backgroundColor: theme.background,
                    paddingBottom: Math.max(insets.bottom, 24)
                  },
                  containerStyle
                ]}
              >
                {/* Standard Drag Handle */}
                <View style={styles.dragHandleContainer}>
                  <View
                    style={[
                      styles.dragHandle,
                      { backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" },
                    ]}
                  />
                </View>
                
                <View style={styles.innerContent}>
                  {children}
                </View>
              </View>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
  },
  closeButtonContainer: {
    marginBottom: 16,
    width: '100%',
    alignItems: 'center', // Aligns the cross to the center horizontally
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    flexShrink: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  innerContent: {
    paddingHorizontal: 20,
    flexShrink: 1,
    width: "100%",
  },
});
