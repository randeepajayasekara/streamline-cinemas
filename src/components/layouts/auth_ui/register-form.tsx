import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label"

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-black dark:text-white">Register</h1>
        <p className="text-balance text-sm text-black dark:text-white">
          Enter your email below to register
        </p>
      </div>
      <div className="grid gap-6 text-black dark:text-white">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" placeholder="Enter a strong password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>
      <div className="text-center text-sm text-black dark:text-white">
        Have an account?{" "}
        <Link to="/portal/_login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  )
}
