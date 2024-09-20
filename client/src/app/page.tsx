import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to AuthApp</CardTitle>
          <CardDescription>Your secure authentication solution</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Get started by logging in or creating a new account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/register">Register</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}