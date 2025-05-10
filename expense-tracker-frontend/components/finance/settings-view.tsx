import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { savingsApi } from "@/lib/api/savings";

export default function SettingsView() {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      setLoading(true);
      try {
        // Example: Fetch savings goals and create achievements
        const savingsGoals = await savingsApi.getAllSavings();
        const achs = [];
        if (savingsGoals.length > 0) {
          achs.push({
            title: "Created your first savings goal!",
            value: 1,
            max: 1,
          });
        }
        const completedGoals = savingsGoals.filter(g => g.initial_amount >= g.target_amount);
        if (completedGoals.length > 0) {
          achs.push({
            title: `Completed ${completedGoals.length} savings goal${completedGoals.length > 1 ? 's' : ''}!`,
            value: completedGoals.length,
            max: savingsGoals.length,
          });
        }
        if (savingsGoals.some(g => g.initial_amount >= 10000)) {
          achs.push({
            title: "Saved Rs 10,000 in a goal!",
            value: 10000,
            max: 10000,
          });
        }
        // Add more achievement logic as needed
        setAchievements(achs);
      } catch (e) {
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAchievements();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#131313] flex flex-col items-center">
      <div className="w-full max-w-[1200px] p-4 md:p-6 mt-4 md:mt-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Profile</h1>
        <div className="border-b border-[#e2e8f0] dark:border-[#4e4e4e] mb-4" />
        <p className="text-gray-500 dark:text-[#b0b0b0] mb-8">Edit and manage your profile</p>
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
          {/* Left: Avatar, Username, Email */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
            <Avatar className="h-40 w-40 mb-4 border border-[#e2e8f0] dark:border-[#4e4e4e]">
              <AvatarImage src={user?.avatar || "/assets/profile-placeholder.png"} alt={user?.fullname || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-5xl">{user?.fullname?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <h2 className="text-5xl font-bold mt-2 text-gray-900 dark:text-white">{user?.fullname || "Username"}</h2>
            <p className="text-2xl text-gray-500 dark:text-[#b0b0b0] mb-4">{user?.email || "user@gmail.com"}</p>
          </div>
          {/* Right: Profile, Settings, Logout */}
          <div className="flex flex-row gap-4 w-full md:w-2/3 justify-end items-start mt-4 md:mt-0">
            <Button variant="outline" className="rounded-xl px-6 py-2 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-[#4e4e4e] cursor-default" disabled>
              <span className="flex items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4Z"/></svg>
                Profile
              </span>
            </Button>
            <Button variant="outline" className="rounded-xl px-3 py-2 border-gray-300 dark:border-[#4e4e4e] flex items-center" disabled>
              <Settings className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </Button>
            <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-xl px-6 py-2 border-red-300 dark:border-red-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setShowLogout(true)}>Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>This will end your current session.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {/* Achievements Section */}
        <div className="w-full">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Achievements</h3>
          <div className="border-b border-[#e2e8f0] dark:border-[#4e4e4e] mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center py-8 text-gray-400">Loading achievements...</div>
            ) : achievements.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-400">No achievements yet. Start saving to unlock achievements!</div>
            ) : achievements.map((ach, idx) => (
              <Card key={idx} className="p-4 border border-[#e2e8f0] dark:border-[#4e4e4e] bg-white dark:bg-[#232323]">
                <div className="font-semibold mb-2 text-[15px] text-gray-900 dark:text-white">{ach.title}</div>
                {ach.max > 1 && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600 font-bold">{ach.value}</span>
                    <span className="text-gray-400 dark:text-gray-500">/ {ach.max}</span>
                  </div>
                )}
                {ach.max > 1 && <Progress value={(ach.value / ach.max) * 100} className="h-2 bg-gray-100 dark:bg-[#333]" />}
                {ach.max === 1 && ach.value === 1 && <Progress value={100} className="h-2 bg-gray-100 dark:bg-[#333]" />}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 