import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, User, Phone, Mail, AtSign } from "lucide-react-native";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import * as ImagePicker from 'expo-image-picker';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';

export default function EditProfile() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?img=11");
  const [fullName, setFullName] = useState("Hanika Gowda");
  const [phone, setPhone] = useState("0000-0000-0000");
  const [email, setEmail] = useState("hanika@email.com");
  const [username, setUsername] = useState("@hanika");

  const scrollY = useSharedValue(0);

  const handleVerticalScroll = useAnimatedScrollHandler((event) => { scrollY.value = event.contentOffset.y; });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Profile" scrollY={scrollY} />

      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        onScroll={handleVerticalScroll}
        scrollEventThrottle={16}
      >
        
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: profileImage }} 
              style={styles.profileImage} 
            />
            <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8} onPress={pickImage}>
              <Camera size={18} color={theme.text} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Input 
            label="Full name"
            placeholder="Enter full name"
            value={fullName}
            onChangeText={setFullName}
            Icon={User}
          />
          
          <Input 
            label="Phone number"
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            Icon={Phone}
          />

          <Input 
            label="Email"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            Icon={Mail}
          />

          <Input 
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            Icon={AtSign}
          />
        </View>

        {/* Save Button */}
        <Button 
          title="Save Changes" 
          onPress={() => {}} 
        />

      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    // Background color inherited globally from _layout.tsx
  },
  scrollContent: {
    paddingTop: 100, // For the fixed glass header
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: theme.primary, // Accent 01
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: theme.background, // Match the background to create a cutout effect
  },
  formContainer: {
    marginBottom: 32,
  },
});




