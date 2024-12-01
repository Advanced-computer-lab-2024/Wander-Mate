'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList } from "../components/ui/tabs"
import { Button } from "../components/ui/button"

export default function AdminDetailsView() {
  const [details, setDetails] = useState({
    username: 'Loading...',
    email: 'Loading...'
  })

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const username = sessionStorage.getItem("username") || 'No username found'
        setDetails(prevDetails => ({ ...prevDetails, username }))
      } catch (error) {
        console.error('Error loading admin details:', error)
        setDetails({ username: 'Error', email: 'Error' })
      }
    }
    loadDetails()
  }, [])

  return (
    <div className="w-full max-w-3xl p-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="border-b rounded-none w-full justify-start h-auto p-0 bg-transparent">
        </TabsList>
        <TabsContent value="personal" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="p-2 bg-muted rounded-md">{details.username}</div>
            </div>
            
          </div>
          <div className="mt-6">
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">Edit</Button>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div className="mt-6">
            <p>Password change functionality to be implemented.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
