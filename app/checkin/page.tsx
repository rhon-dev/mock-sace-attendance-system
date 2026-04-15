"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { CheckinScreen } from "@/components/checkin-screen"
import { ToastProvider } from "@/components/toast-provider"

export default function CheckinPage() {
  return (
    <ToastProvider>
      <DashboardLayout>
        <CheckinScreen />
      </DashboardLayout>
    </ToastProvider>
  )
}
