import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Settings, LogOut, User as UserIcon, Eye, EyeOff, Upload, Trash2 } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { savingsApi } from "@/lib/api/savings";
import { profileAPI } from "@/lib/api";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function SettingsView() {
  const { user, logout, sendPasswordResetEmail, setUser } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'achievements' | 'privacy' | 'profile'>('achievements');
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [newUsername, setNewUsername] = useState(user?.fullname || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAchievements() {
      setLoading(true);
      try {
        const savingsGoals = await savingsApi.getAllSavings();
        const expenses = [{ amount: 100 }, { amount: 200 }]; // Replace with real fetch
        const budgets = [{ amount: 1000 }]; // Replace with real fetch
        const achs = [];
        if (user) achs.push({ title: "Welcome! First Login", value: 1, max: 1 });
        if (expenses.length > 0) achs.push({ title: "Logged your first expense", value: 1, max: 1 });
        if (budgets.length > 0) achs.push({ title: "Created your first budget", value: 1, max: 1 });
        if (savingsGoals.length > 0) achs.push({ title: "Created your first savings goal!", value: 1, max: 1 });
        const completedGoals = savingsGoals.filter(g => g.initial_amount >= g.target_amount);
        if (completedGoals.length > 0) achs.push({ title: `Completed ${completedGoals.length} savings goal${completedGoals.length > 1 ? 's' : ''}!`, value: completedGoals.length, max: savingsGoals.length });
        if (savingsGoals.some(g => g.initial_amount >= 10000)) achs.push({ title: "Saved Rs 10,000 in a goal!", value: 10000, max: 10000 });
        achs.push({ title: "Visited the Profile Page", value: 1, max: 1 });
        achs.push({ title: "Set a financial goal", value: savingsGoals.length > 0 ? 1 : 0, max: 1 });
        achs.push({ title: "Added two expenses", value: expenses.length >= 2 ? 2 : expenses.length, max: 2 });
        achs.push({ title: "Created a monthly budget", value: budgets.length > 0 ? 1 : 0, max: 1 });
        achs.push({ title: "Saved Rs 1,000 in total", value: savingsGoals.reduce((sum, g) => sum + g.initial_amount, 0) >= 1000 ? 1000 : savingsGoals.reduce((sum, g) => sum + g.initial_amount, 0), max: 1000 });
        achs.push({ title: "Saved Rs 5,000 in total", value: savingsGoals.reduce((sum, g) => sum + g.initial_amount, 0) >= 5000 ? 5000 : savingsGoals.reduce((sum, g) => sum + g.initial_amount, 0), max: 5000 });
        achs.push({ title: "Saved Rs 20,000 in total", value: savingsGoals.reduce((sum, g) => sum + g.initial_amount, 0) >= 20000 ? 20000 : savingsGoals.reduce((sum, g) => sum + g.initial_amount, 0), max: 20000 });
        achs.push({ title: "Completed a goal before deadline", value: 0, max: 1 });
        achs.push({ title: "Logged in for 7 days", value: 0, max: 7 });
        achs.push({ title: "Logged in for 30 days", value: 0, max: 30 });
        achs.push({ title: "Added an expense in every category", value: 0, max: 1 });
        achs.push({ title: "Created 5 savings goals", value: savingsGoals.length >= 5 ? 5 : savingsGoals.length, max: 5 });
        achs.push({ title: "Completed all savings goals", value: completedGoals.length === savingsGoals.length && savingsGoals.length > 0 ? 1 : 0, max: 1 });
        // Add 5 more achievements
        achs.push({ title: "First time using dark mode", value: 0, max: 1 });
        achs.push({ title: "Exported your data", value: 0, max: 1 });
        achs.push({ title: "Added a recurring expense", value: 0, max: 1 });
        achs.push({ title: "Set a budget alert", value: 0, max: 1 });
        achs.push({ title: "Shared your progress", value: 0, max: 1 });
        setAchievements(achs);
      } catch (e) {
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAchievements();
  }, [user]);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!newUsername.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await profileAPI.updateUsername(user.id, newUsername);

      if (response.success) {
        toast({
          title: "Success",
          description: "Username updated successfully",
          variant: "default",
        });
        // Update local user state
        if (user) {
          user.fullname = newUsername;
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update username",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update username",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user?.id) return;

  if (!currentPassword || !newPassword || !confirmPassword) {
    toast({
      title: "Error",
      description: "All password fields are required",
      variant: "destructive",
    });
    return;
  }

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
  if (!passwordRegex.test(newPassword)) {
    toast({
      title: "Error",
      description: "Password must include at least one number and one special character (@, #, $, etc.)",
      variant: "destructive",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    toast({
      title: "Error",
      description: "Passwords do not match",
      variant: "destructive",
    });
    return;
  }

  if (newPassword.length < 6) {
    toast({
      title: "Error",
      description: "Password must be at least 6 characters long",
      variant: "destructive",
    });
    return;
  }

  setIsUpdating(true);
  try {
    const response = await profileAPI.updatePassword(user.id, currentPassword, newPassword);

    if (response.success) {
      toast({
        title: "Success",
        description: "Password updated successfully",
        variant: "default",
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      // Modified error for incorrect current password
      const errorMsg = response.message?.toLowerCase().includes('incorrect') 
        ? 'Incorrect current password'
        : response.message || 'Failed to update password';

      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  } catch (error: any) {
    const errorMsg = error.message?.toLowerCase().includes('incorrect') 
      ? 'Incorrect current password'
      : error.message || 'Failed to update password';

    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive",
    });
  } finally {
    setIsUpdating(false);
  }
};


  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id || !e.target.files?.length) return;

    const file = e.target.files[0];
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)) {
      toast({
        title: "Error",
        description: "Only JPG, PNG, GIF and SVG files are allowed",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await profileAPI.uploadProfilePicture(user.id, file);

      if (response.success) {
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
          variant: "default",
        });
        // Update local user state
        if (user) {
          user.profilePicture = response.data.data.profilePicture;
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update profile picture",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!user?.id) return;

    setIsUpdating(true);
    try {
      const result = await profileAPI.removeProfilePicture(user.id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Profile picture removed successfully",
          variant: "default",
        });
        // Update local state with empty profile picture
        setUser(user ? {
          ...user,
          profilePicture: { public_id: '', url: '' }
        } : null);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to remove profile picture",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 h-[calc(100vh-100px)] overflow-hidden bg-[#f9f9f9] dark:bg-[#131313] flex flex-col items-center w-full">
      <div className="w-full mx-auto overflow-y-auto">
        {/* Profile/Settings Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-0 mb-8 w-full">
          {/* Left: Avatar, Name, Email */}
          <div className="flex items-center gap-6">
            <Avatar className="h-28 w-28 border border-[#e2e8f0] dark:border-[#4e4e4e]">
              <AvatarImage src={user?.profilePicture?.url || "/assets/profile-placeholder.png"} alt={user?.fullname || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-5xl">{user?.fullname?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{user?.fullname || "Username"}</div>
              <div className="text-lg text-gray-500 dark:text-[#b0b0b0]">{user?.email || "user@gmail.com"}</div>
            </div>
          </div>
          {/* Right: Profile, Settings, Logout (icons) */}
          <div className="flex flex-row gap-4 items-center justify-end mt-6 md:mt-0">
            <Button className="bg-transparent border hover:bg-transparent rounded-xl p-0 h-12 w-[140px] flex items-center justify-center border-gray-300 dark:border-[#4e4e4e] gap-2" onClick={() => setActiveTab('profile')}>
              <UserIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              <span className="text-lg font-semibold text-gray-400 dark:text-gray-200">Profile</span>
            </Button>
            <Button className="bg-transparent border hover:bg-transparent rounded-xl p-0 h-12 w-[140px] flex items-center justify-center border-gray-300 dark:border-[#4e4e4e] gap-2" onClick={() => setActiveTab('privacy')}>
              <Settings className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              <span className="text-lg font-semibold text-gray-400 dark:text-gray-200">Settings</span>
            </Button>
            <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="rounded-xl p-0 h-12 w-[140px] flex items-center justify-center border-red-300 dark:border-destructive/80 text-red-500 hover:bg-destructive/90 hover:text-destructive-foreground dark:hover:bg-destructive/80 gap-2" onClick={() => setShowLogout(true)}>
                  <LogOut className="h-6 w-6" />
                  <span className="text-lg font-semibold">Logout</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                  <AlertDialogDescription>This will end your current session.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {/* Section Content */}
        {activeTab === 'achievements' && (
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Achievements</h3>
            <div className="border-b border-[#e2e8f0] dark:border-[#4e4e4e] mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-3 text-center py-8 text-gray-400">Loading achievements...</div>
              ) : achievements.length === 0 ? (
                <div className="col-span-3 text-center py-8 text-gray-400">No achievements yet. Start saving to unlock achievements!</div>
              ) : achievements.map((ach, idx) => (
                <Card key={idx} className="p-4 border border-[#e2e8f0] dark:border-[#4e4e4e] bg-transparent dark:bg-transparent flex flex-col justify-between">
                  <div className="font-semibold mb-2 text-[15px] text-gray-900 dark:text-white">{ach.title}</div>
                  {ach.max > 1 && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-600 font-bold">{ach.value}</span>
                      <span className="text-gray-400 dark:text-gray-500">/ {ach.max}</span>
                    </div>
                  )}
                  {ach.max > 1 && <Progress value={(ach.value / ach.max) * 100} className="h-2 bg-gray-100 dark:bg-[#333] [&>div]:!bg-[#2ECC71]" />}
                  {ach.max === 1 && ach.value === 1 && <Progress value={100} className="h-2 bg-gray-100 dark:bg-[#333] [&>div]:!bg-[#2ECC71]" />}
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'privacy' && (
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Privacy Settings</h3>
            <div className="border-b border-[#e2e8f0] dark:border-[#4e4e4e] mb-12" />
            <form className="max-w-2xl" onSubmit={handlePasswordUpdate}>
              <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                <label className="text-lg font-semibold text-gray-900 dark:text-white w-32" htmlFor="email">Email</label>
                <input id="email" type="email" className="flex-1 rounded-xl border border-gray-200 dark:border-[#4e4e4e] px-4 py-3 text-lg bg-white dark:bg-[#232323] text-gray-900 dark:text-white" value={user?.email || ''} disabled />
              </div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                <label className="text-lg font-semibold text-gray-900 dark:text-white w-32" htmlFor="currentPassword">Current Password</label>
                <div className="flex-1 relative">
                  <input 
                    id="currentPassword" 
                    type={showCurrentPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-gray-200 dark:border-[#4e4e4e] px-4 py-3 text-lg bg-white dark:bg-[#232323] text-gray-900 dark:text-white pr-12" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                <label className="text-lg font-semibold text-gray-900 dark:text-white w-32" htmlFor="newPassword">New Password</label>
                <div className="flex-1 relative">
                  <input 
                    id="newPassword" 
                    type={showNewPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-gray-200 dark:border-[#4e4e4e] px-4 py-3 text-lg bg-white dark:bg-[#232323] text-gray-900 dark:text-white pr-12" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
                <label className="text-lg font-semibold text-gray-900 dark:text-white w-32" htmlFor="confirmPassword">Confirm Password</label>
                <div className="flex-1 relative">
                  <input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-gray-200 dark:border-[#4e4e4e] px-4 py-3 text-lg bg-white dark:bg-[#232323] text-gray-900 dark:text-white pr-12" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="bg-transparent rounded-xl px-10 py-3 text-gray-400 hover:text-gray-400 dark:text-gray-200 border-gray-300 dark:border-[#4e4e4e] font-semibold" onClick={() => setActiveTab('achievements')}>Back</Button>
                <Button type="submit" className="rounded-xl px-10 py-3 bg-[#27ae60] hover:bg-[#219150] text-white text-lg font-semibold" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="w-full">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profile Settings</h3>
            <div className="border-b border-[#e2e8f0] dark:border-[#4e4e4e] mb-12" />
            <form className="max-w-2xl" onSubmit={handleUsernameUpdate}>
              <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
                <label className="text-lg font-semibold text-gray-900 dark:text-white w-32" htmlFor="username">Username</label>
                <input 
                  id="username" 
                  type="text" 
                  className="flex-1 rounded-xl border border-gray-200 dark:border-[#4e4e4e] px-4 py-3 text-lg bg-white dark:bg-[#232323] text-gray-900 dark:text-white" 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
                <label className="text-lg font-semibold text-gray-900 dark:text-white w-32" htmlFor="avatar">Avatar</label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border border-[#e2e8f0] dark:border-[#4e4e4e]">
                    <AvatarImage src={user?.profilePicture?.url || "/assets/profile-placeholder.png"} alt={user?.fullname || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">{user?.fullname?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG, Max size of 5MB<br />
                    <div className="flex gap-2 mt-1">
                      <label className="text-green-600 cursor-pointer hover:text-green-700">
                        Upload photo
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/gif,image/svg+xml"
                          onChange={handleProfilePictureUpload}
                          disabled={isUpdating}
                        />
                      </label>
                      {/* {user?.profilePicture?.url && (
                        <button
                          type="button"
                          className="text-green-600 cursor-pointer hover:text-green-700"
                          onClick={handleRemoveProfilePicture}
                          disabled={isUpdating}
                        >
                          Remove photo
                        </button>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="bg-transparent rounded-xl px-10 py-3 text-gray-400 hover:text-gray-400 dark:text-gray-200 border-gray-300 dark:border-[#4e4e4e] font-semibold" onClick={() => setActiveTab('achievements')}>Back</Button>
                <Button type="submit" className="rounded-xl px-10 py-3 bg-[#27ae60] hover:bg-[#219150] text-white text-lg font-semibold" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 