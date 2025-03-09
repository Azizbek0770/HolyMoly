import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, changePassword } from "@/api/users";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Camera,
  Save,
  Lock,
} from "lucide-react";

export default function ProfileForm() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");

  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    birthdate: "",
    avatar: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Errors
  const [personalErrors, setPersonalErrors] = useState<Record<string, string>>(
    {},
  );
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        birthdate: user.birthdate || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user types
    if (personalErrors[id]) {
      setPersonalErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error when user types
    if (passwordErrors[id]) {
      setPasswordErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validatePersonalInfo = () => {
    const errors: Record<string, string> = {};

    if (!personalInfo.name.trim()) {
      errors.name = "Name is required";
    }

    if (!personalInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(personalInfo.email)) {
      errors.email = "Invalid email format";
    }

    if (
      personalInfo.phone &&
      !/^\(\d{3}\) \d{3}-\d{4}$|^\d{10}$/.test(personalInfo.phone)
    ) {
      errors.phone = "Invalid phone format. Use (123) 456-7890 or 1234567890";
    }

    setPersonalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordData = () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePersonalInfo()) {
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingProfile(true);

    try {
      // Format phone number if needed
      let formattedPhone = personalInfo.phone;
      if (
        formattedPhone &&
        formattedPhone.length === 10 &&
        !formattedPhone.includes("(")
      ) {
        formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(3, 6)}-${formattedPhone.slice(6)}`;
      }

      const updatedUser = await updateUserProfile({
        userId: user.id,
        name: personalInfo.name,
        email: personalInfo.email,
        phone: formattedPhone,
        bio: personalInfo.bio,
        birthdate: personalInfo.birthdate,
        avatar: personalInfo.avatar,
      });

      // Update the user in context
      updateUser(updatedUser);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordData()) {
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to change your password",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({
        userId: user.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to a storage service
    // For now, we'll just simulate it with a delay and use a placeholder
    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would be the URL returned from your upload service
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;

      setPersonalInfo((prev) => ({
        ...prev,
        avatar: avatarUrl,
      }));

      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile}>
                <div className="space-y-6">
                  {/* Avatar section */}
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={
                            personalInfo.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                          }
                        />
                        <AvatarFallback>
                          {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-full">
                          <Spinner size="sm" />
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2">
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer"
                        >
                          <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                            <Camera className="h-4 w-4" />
                          </div>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4 text-center sm:text-left">
                      <div>
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>2 Saved Addresses</span>
                        </div>
                        <div className="hidden sm:block text-muted-foreground">
                          •
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Member since{" "}
                            {new Date(
                              user.createdAt || Date.now(),
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" /> Full Name
                        </Label>
                        <Input
                          id="name"
                          value={personalInfo.name}
                          onChange={handlePersonalChange}
                          className={
                            personalErrors.name ? "border-red-500" : ""
                          }
                        />
                        {personalErrors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {personalErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" /> Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={handlePersonalChange}
                          className={
                            personalErrors.email ? "border-red-500" : ""
                          }
                        />
                        {personalErrors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {personalErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" /> Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalChange}
                          placeholder="(123) 456-7890"
                          className={
                            personalErrors.phone ? "border-red-500" : ""
                          }
                        />
                        {personalErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {personalErrors.phone}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="birthdate"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" /> Date of Birth
                        </Label>
                        <Input
                          id="birthdate"
                          type="date"
                          value={personalInfo.birthdate}
                          onChange={handlePersonalChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={personalInfo.bio}
                        onChange={handlePersonalChange}
                        placeholder="Tell us a little about yourself"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? (
                      <>
                        <Spinner size="sm" className="mr-2" /> Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={
                        passwordErrors.currentPassword ? "border-red-500" : ""
                      }
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={
                        passwordErrors.newPassword ? "border-red-500" : ""
                      }
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" /> Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={
                        passwordErrors.confirmPassword ? "border-red-500" : ""
                      }
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Spinner size="sm" className="mr-2" /> Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" /> Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
