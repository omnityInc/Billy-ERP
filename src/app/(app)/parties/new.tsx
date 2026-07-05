import { Dropdown } from "@/components/shared/Dropdown";
import { FilterTabs } from "@/components/shared/FilterTabs";
import { Input } from "@/components/shared/Input";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { GST_STATE_CODES } from "@/constants/gst";
import { StatusBar } from "expo-status-bar";
import { Maximize2, Minimize2 } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REGISTRATION_TYPES = [
  { label: "Unregistered", value: "Unregistered" },
  { label: "Regular", value: "Regular" },
  { label: "Regular-Embassy/UN Body", value: "Regular-Embassy/UN Body" },
  { label: "Regular-SEZ", value: "Regular-SEZ" },
  { label: "Composition", value: "Composition" },
];

const COUNTRY_OPTIONS = [
  { label: "India", value: "India" },
  { label: "United States", value: "United States" },
  { label: "United Arab Emirates", value: "UAE" },
];

export default function AddPartyScreen() {
  const [partyType, setPartyType] = useState("Customer");
  const [registrationType, setRegistrationType] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [balanceType, setBalanceType] = useState("Credit");
  const [gstin, setGstin] = useState("");
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      edges={["top"]}
    >
      <StatusBar style="dark" />
      <ScreenHeader title="Add Party" subtitle="Add Customer | Vendor" />

      <FilterTabs
        tabs={["Customer", "Vendor", "Customer | Vendor"]}
        activeTab={partyType}
        onChange={setPartyType}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <Text className="text-h3 text-black mb-4">Basic Details</Text>

          <Input
            label="GSTIN"
            placeholder="Enter GSTIN (Optional)"
            containerClassName="mb-4"
            value={gstin}
            onChangeText={setGstin}
            autoCapitalize="characters"
            rightIcon={
              <Pressable
                className={`px-3 py-1.5 rounded-md ${gstin ? "bg-black" : "bg-natural-100"}`}
                disabled={!gstin}
                onPress={() => {
                  if (gstin) {
                    console.log("Auto-fill triggered for:", gstin);
                  }
                }}
              >
                <Text
                  className={`text-[11px] font-sans-bold tracking-wide ${gstin ? "text-white" : "text-natural-400"}`}
                >
                  AUTO-FILL
                </Text>
              </Pressable>
            }
          />
          <Input
            label="Company Name"
            placeholder="Enter company name"
            required
            containerClassName="mb-4"
          />
          <Input
            label="Contact No."
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            containerClassName="mb-4"
          />
          <Input
            label="Email"
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            containerClassName="mb-4"
          />
          <View className="mb-4">
            <Dropdown
              label="Registration Type"
              options={REGISTRATION_TYPES}
              value={registrationType}
              onSelect={setRegistrationType}
              placeholder="Select registration type"
            />
          </View>
          <Input
            label="PAN"
            placeholder="Enter PAN number"
            autoCapitalize="characters"
          />
        </View>

        {/* Billing Address Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <Text className="text-h3 text-black mb-4">Billing Address</Text>

          <Input
            label="Address"
            placeholder="Enter billing address"
            multiline
            numberOfLines={isAddressExpanded ? 6 : 3}
            style={isAddressExpanded ? { minHeight: 120 } : undefined}
            containerClassName="mb-4"
            rightIcon={
              <Pressable
                onPress={() => setIsAddressExpanded(!isAddressExpanded)}
                className="p-1"
              >
                {isAddressExpanded ? (
                  <Minimize2 size={20} color="#9CA3AF" />
                ) : (
                  <Maximize2 size={20} color="#9CA3AF" />
                )}
              </Pressable>
            }
          />
          <Input
            label="Landmark"
            placeholder="Enter landmark"
            containerClassName="mb-4"
          />
          <Input
            label="City"
            placeholder="Enter city"
            required
            containerClassName="mb-4"
          />
          <View className="mb-4 z-20">
            <Dropdown
              label="Country"
              options={COUNTRY_OPTIONS}
              value={country}
              onSelect={setCountry}
              required
            />
          </View>
          <View className="mb-4 z-10">
            <Dropdown
              label="State"
              options={GST_STATE_CODES}
              value={state}
              onSelect={setState}
              required
            />
          </View>
          <Input
            label="Pincode"
            placeholder="Enter pincode"
            keyboardType="number-pad"
            containerClassName="mb-4"
          />
          <Input
            label="Distance for E-Way Bill (in Km)"
            placeholder="Enter distance"
            keyboardType="numeric"
          />
        </View>

        {/* Opening Balance Section */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-natural-200 shadow-sm">
          <Text className="text-h3 text-black mb-4">Opening Balance</Text>

          <View className="flex-row items-end gap-x-3 mb-2">
            <View className="flex-1">
              <Input label="Amount" placeholder="0.00" keyboardType="numeric" />
            </View>
            <View className="flex-row bg-natural-100 p-1 rounded-xl h-14 w-40">
              <Pressable
                onPress={() => setBalanceType("Credit")}
                className={`flex-1 items-center justify-center rounded-lg ${balanceType === "Credit" ? "bg-white shadow-sm" : ""}`}
              >
                <Text
                  className={`text-sm font-sans-medium ${balanceType === "Credit" ? "text-black" : "text-natural-500"}`}
                >
                  Credit
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setBalanceType("Debit")}
                className={`flex-1 items-center justify-center rounded-lg ${balanceType === "Debit" ? "bg-white shadow-sm" : ""}`}
              >
                <Text
                  className={`text-sm font-sans-medium ${balanceType === "Debit" ? "text-black" : "text-natural-500"}`}
                >
                  Debit
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Add Fields Section */}
        <View className="bg-white rounded-2xl p-5 mb-6 border border-natural-200 shadow-sm">
          <Text className="text-h3 text-black mb-4">Add Fields</Text>
          <Pressable className="opacity-50">
            <View pointerEvents="none">
              <Input placeholder="+ Add custom text field" editable={false} />
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-natural-200 px-4 py-4"
        style={{ paddingBottom: Platform.OS === "ios" ? 34 : 16 }}
      >
        <Pressable className="w-full bg-black py-4 rounded-xl items-center shadow-sm">
          <Text className="text-white text-body-strong">Save & Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
