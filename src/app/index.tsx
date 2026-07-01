import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import "../global.css";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading/initialization
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ImageBackground
      source={require("../../assets/images/splashpattern.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />

      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../../assets/images/icon.png")}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </View>

      <View className="pb-20">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1c1c1e",
  },
});
