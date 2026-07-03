import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import "../../global.css";

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/log-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
