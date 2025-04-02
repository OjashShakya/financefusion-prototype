// "use client"

// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { useRouter } from "next/navigation"
// import { Eye, EyeOff, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useAuth } from "./auth-context"

// type LoginFormValues = {
//   email: string
//   password: string
// }

// export function LoginForm() {
//   const { login } = useAuth()
//   const router = useRouter()
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>()

//   const onSubmit = async (data: LoginFormValues) => {
//     setError(null)
//     setIsLoading(true)

//     try {
//       const success = await login(data.email, data.password)
//       if (success) {
//         router.push("/")
//       } else {
//         setError("Invalid email or password. Please try again.")
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again.")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl">Login</CardTitle>
//         <CardDescription>Enter your credentials to access your account</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="name@example.com"
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: {
//                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                   message: "Invalid email address",
//                 },
//               })}
//             />
//             {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 className="pr-10"
//                 {...register("password", {
//                   required: "Password is required",
//                   minLength: {
//                     value: 6,
//                     message: "Password must be at least 6 characters",
//                   },
//                 })}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
//               </Button>
//             </div>
//             {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Logging in...
//               </>
//             ) : (
//               "Login"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//       <CardFooter className="flex justify-center">
//         <p className="text-sm text-muted-foreground">
//           Don't have an account?{" "}
//           <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/signup")}>
//             Sign up
//           </Button>
//         </p>
//       </CardFooter>
//     </Card>
//   )
// }

