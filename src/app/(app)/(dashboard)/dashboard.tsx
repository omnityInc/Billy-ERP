import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GSTLiabilityCard } from "@/components/dashboard/GSTLiabilityCard";
import { InventoryMoversSection } from "@/components/dashboard/InventoryMoversSection";
import { NeedsAttentionSection } from "@/components/dashboard/NeedsAttentionSection";
import { OutstandingSection } from "@/components/dashboard/OutstandingSection";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { Paise } from "@/utils/format";
import { StatusBar } from "expo-status-bar";
import { Search, CircleAlert, ArrowRight } from "lucide-react-native";
import { ScrollView, Text, TextInput, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GSTLiabilityCardSkeleton, SummaryCardSkeleton } from "@/components/shared/Skeleton";
import { FloatingMenu } from "@/components/shared/FloatingMenu";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/data/mockApi";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  const { data: salesInvoices, isLoading: isSalesLoading, isError: isSalesError } = useQuery({
    queryKey: ["salesInvoices"],
    queryFn: mockApi.getSalesInvoices,
  });

  const { data: purchaseInvoices, isLoading: isPurchaseLoading, isError: isPurchaseError } = useQuery({
    queryKey: ["purchaseInvoices"],
    queryFn: mockApi.getPurchaseInvoices,
  });

  const isLoading = isSalesLoading || isPurchaseLoading;

  if (isSalesError || isPurchaseError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#EEF2FF", justifyContent: "center", alignItems: "center" }}>
        <Text className="text-label text-natural-500">Error loading dashboard data.</Text>
      </SafeAreaView>
    );
  }

  const totalSales = (salesInvoices?.reduce((acc, inv) => acc + inv.taxableAmountPaise, 0) || 0) as Paise;
  const totalSalesGst = (salesInvoices?.reduce((acc, inv) => acc + inv.taxAmountPaise, 0) || 0) as Paise;

  const totalPurchase = (purchaseInvoices?.reduce((acc, inv) => acc + inv.taxableAmountPaise, 0) || 0) as Paise;
  const totalPurchaseGst = (purchaseInvoices?.reduce((acc, inv) => acc + inv.taxAmountPaise, 0) || 0) as Paise;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#EEF2FF" }}
      edges={["top", "left", "right"]}
    >
      <StatusBar style="dark" />
      <DashboardHeader />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 mb-4 mt-2">
          <View className="flex-row items-center bg-white rounded-[14px] px-4 py-3 border border-natural-100 shadow-sm">
            <Search color="#94A3B8" size={20} />
            <TextInput
              placeholder="Search for anything..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 text-base text-black"
              style={{ padding: 0, margin: 0 }}
            />
          </View>
        </View>

        {/* Business Profile Alert */}
        <Pressable 
          className="mx-4 mb-4 flex-row items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-sm"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          onPress={() => router.push("/(app)/(settings)/business-details")}
        >
          <View className="flex-row items-center flex-1 mr-4">
            <CircleAlert color="#EF4444" size={20} />
            <Text className="text-[14px] font-sans-medium text-red-700 ml-3 flex-1" numberOfLines={1}>
              Setup your business profile
            </Text>
          </View>
          <ArrowRight color="#EF4444" size={20} />
        </Pressable>

        <View className="mb-6">
          {isLoading ? <GSTLiabilityCardSkeleton /> : <GSTLiabilityCard />}
        </View>

        <QuickActions />

        <View className="flex-row gap-x-4 px-4">
          {isLoading ? (
            <>
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
            </>
          ) : (
            <>
              <SummaryCard
                title="Sales"
                total={totalSales}
                gst={totalSalesGst}
                trend="down"
              />
              <SummaryCard
                title="Purchase"
                total={totalPurchase}
                gst={totalPurchaseGst}
                trend="up"
              />
            </>
          )}
        </View>

        <NeedsAttentionSection />

        <PerformanceChart />
        <CashFlowChart />

        <OutstandingSection
          title="Sales Outstanding"
          totalLabel="Total Receivables"
          totalAmount={404331778000 as Paise}
          data={[
            {
              label: "Current",
              amount: 281808195900 as Paise,
              color: "#10B981",
            },
            {
              label: "1–30 Days",
              amount: 23086398100 as Paise,
              color: "#EAB308",
            },
            {
              label: "31–60 Days",
              amount: 36201064000 as Paise,
              color: "#F97316",
            },
            {
              label: "61–90 Days",
              amount: 1533920000 as Paise,
              color: "#EF4444",
            },
            {
              label: "90+ Days",
              amount: 61702200000 as Paise,
              color: "#B91C1C",
            },
          ]}
        />

        <OutstandingSection
          title="Purchase Outstanding"
          totalLabel="Total Payables"
          totalAmount={202797858000 as Paise}
          data={[
            {
              label: "Current",
              amount: 121808195900 as Paise,
              color: "#10B981",
            },
            {
              label: "1–30 Days",
              amount: 13086398100 as Paise,
              color: "#EAB308",
            },
            {
              label: "31–60 Days",
              amount: 16201064000 as Paise,
              color: "#F97316",
            },
            { label: "61–90 Days", amount: 0 as Paise, color: "#EF4444" },
            {
              label: "90+ Days",
              amount: 51702200000 as Paise,
              color: "#B91C1C",
            },
          ]}
        />

        <InventoryMoversSection />

        <View className="items-center mt-2 pb-4">
          <Text className="text-[10px] font-sans-medium text-natural-400">
            © 2026 Billy. Built with care. Protected by copyright.
          </Text>
        </View>
      </ScrollView>
      
      <FloatingMenu />
    </SafeAreaView>
  );
}
