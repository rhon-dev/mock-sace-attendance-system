"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ActivityFeed } from "@/components/activity-feed"
import { ToastProvider } from "@/components/toast-provider"

export default function ActivityPage() {
  return (
    <ToastProvider>
      <DashboardLayout>
        <ActivityFeed />
      </DashboardLayout>
    </ToastProvider>
  )
}
