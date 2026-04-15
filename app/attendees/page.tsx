"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AttendeeList } from "@/components/attendee-list"
import { ToastProvider } from "@/components/toast-provider"

export default function AttendeesPage() {
  return (
    <ToastProvider>
      <DashboardLayout>
        <AttendeeList />
      </DashboardLayout>
    </ToastProvider>
  )
}
