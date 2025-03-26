// "use client"

// import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
// import { useRouter } from "next/navigation"

// type User = {
//   id: string
//   name: string
//   email: string
// }

// type AuthContextType = {
//   user: User | null
//   isLoading: boolean
//   login: (email: string, password: string) => Promise<boolean>
//   signup: (name: string, email: string, password: string) => Promise<boolean>
//   logout: () => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   // Check for existing user session on load
//   useEffect(() => {
//     const storedUser = localStorage.getItem("finance_user")
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//     }
//     setIsLoading(false)
//   }, [])

//   // Login function
//   const login = async (email: string, password: string) => {
//     setIsLoading(true)

//     // Simulate API call delay
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // In a real app, you would validate credentials with a backend
//     // For demo purposes, we'll accept any email with a password longer than 5 chars
//     if (password.length > 5) {
//       const newUser = {
//         id: Math.random().toString(36).substring(2, 9),
//         name: email.split("@")[0], // Use part of email as name
//         email,
//       }

//       setUser(newUser)
//       localStorage.setItem("finance_user", JSON.stringify(newUser))
//       setIsLoading(false)
//       return true
//     }

//     setIsLoading(false)
//     return false
//   }

//   // Signup function
//   const signup = async (name: string, email: string, password: string) => {
//     setIsLoading(true)

//     // Simulate API call delay
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // In a real app, you would create a user in your backend
//     // For demo purposes, we'll accept any valid-looking data
//     if (name && email.includes("@") && password.length > 5) {
//       const newUser = {
//         id: Math.random().toString(36).substring(2, 9),
//         name,
//         email,
//       }

//       setUser(newUser)
//       localStorage.setItem("finance_user", JSON.stringify(newUser))
//       setIsLoading(false)
//       return true
//     }

//     setIsLoading(false)
//     return false
//   }

//   // Logout function
//   const logout = () => {
//     setUser(null)
//     localStorage.removeItem("finance_user")
//     router.push("/login")
//   }

//   return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

