'use client'

import { useRef, useState } from 'react'
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

function SubmitButton({ pending }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Admin'}
    </Button>
  )
}

export async function addAdmin(username, password) {
  try {
    const usernameFromSession = sessionStorage.getItem("username")
    
    // Assuming the backend has an 'addAdmin' API endpoint
    const response = await fetch('http://localhost:8000/addAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Username: username, Password: password, CreatedBy: usernameFromSession }), // Adding created by field
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, message: data.message }
    }

    // Handle successful creation (optional - you can manage any additional status like tokens if needed)
    return { success: true, message: 'Admin created successfully' }
  } catch (error) {
    console.error('Error creating admin:', error)
    return { success: false, message: "Can't create the admin" }
  }
}

export default function AddAdminDialog() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const dialogRef = useRef(null)

  const handleOpenChange = (open) => {
    if (open) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsPending(true)

    const result = await addAdmin(username, password) // Call the updated 'addAdmin' function
    setState(result)
    setIsPending(false)

    if (result.success) {
      handleOpenChange(false) // Close dialog on success
    }
  }

  return (
    <Dialog open={state?.success ? false : undefined} onOpenChange={handleOpenChange} ref={dialogRef}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Admin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Enter the details for the new admin account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                className="col-span-3"
                required
                pattern="\S+" // Ensure no spaces in username
                title="Username should not contain spaces"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="col-span-3"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {state && !state.success && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <SubmitButton pending={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
