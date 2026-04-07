"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AttendeePass } from "@/components/attendee-pass"

export default function AttendeePassPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-screen py-8">
        <AttendeePass
          name="Sarah Johnson"
          eventName="Tech Conference 2025"
          isCheckedIn={true}
        />
      </div>
    </DashboardLayout>
  )
}
