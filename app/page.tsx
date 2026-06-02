"use client"

import { NavigationProvider, useNavigation } from "@/lib/navigation-context"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { DashboardContent } from "@/components/pages/dashboard-content"
import { VesselScheduleContent } from "@/components/pages/vessel-schedule-content"
import { SettingsContent } from "@/components/pages/settings-content"

function PageContent() {
  const { currentPage } = useNavigation()

  switch (currentPage) {
    case "dashboard":
      return <DashboardContent />
    case "vessels":
      return <VesselScheduleContent />
    case "settings":
      return <SettingsContent />
    default:
      return <DashboardContent />
  }
}

export default function App() {
  return (
    <NavigationProvider>
      <AppSidebar>
        <PageContent />
      </AppSidebar>
    </NavigationProvider>
  )
}
