"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { OrganizerDashboard } from "@/components/organizer-dashboard"
import { ToastProvider } from "@/components/toast-provider"

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardLayout>
        <OrganizerDashboard />
      </DashboardLayout>
    </ToastProvider>
  )
}
