"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  User,
  Users,
  Bell,
  Shield,
  Mail,
  Smartphone,
  MessageSquare,
  Search,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Check,
  X,
  Edit2,
  Trash2,
  Key,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  MOCK_USERS,
  MOCK_NOTIFICATION_SETTINGS,
  type User as UserType,
  type NotificationSetting,
} from "@/lib/mock-data"

const roleConfig: Record<UserType["role"], { label: string; color: string; bgColor: string }> = {
  admin:    { label: "Admin",    color: "text-status-delayed",  bgColor: "bg-status-delayed/10"  },
  manager:  { label: "Manager",  color: "text-status-transit",  bgColor: "bg-status-transit/10"  },
  operator: { label: "Operator", color: "text-status-approved", bgColor: "bg-status-approved/10" },
  viewer:   { label: "Viewer",   color: "text-muted-foreground",bgColor: "bg-muted"               },
}

const statusConfig: Record<UserType["status"], { label: string; color: string; bgColor: string }> = {
  active:   { label: "Active",   color: "text-status-approved", bgColor: "bg-status-approved/10" },
  inactive: { label: "Inactive", color: "text-muted-foreground",bgColor: "bg-muted"               },
  pending:  { label: "Pending",  color: "text-status-pending",  bgColor: "bg-status-pending/10"  },
}

type EditUserForm = {
  name:       string
  email:      string
  role:       UserType["role"]
  department: string
  status:     UserType["status"]
}

export function SettingsContent() {
  const [searchQuery,   setSearchQuery]   = useState("")
  const [roleFilter,    setRoleFilter]    = useState<string>("all")
  const [notifications, setNotifications] = useState<NotificationSetting[]>(MOCK_NOTIFICATION_SETTINGS)
  const [users,         setUsers]         = useState<UserType[]>(MOCK_USERS)
  const [addUserOpen,   setAddUserOpen]   = useState(false)
  const [editUserOpen,  setEditUserOpen]  = useState(false)
  const [editingUser,   setEditingUser]   = useState<UserType | null>(null)
  const [editForm,      setEditForm]      = useState<EditUserForm | null>(null)

  // Add user form state
  const [newName,       setNewName]       = useState("")
  const [newEmail,      setNewEmail]      = useState("")
  const [newRole,       setNewRole]       = useState<UserType["role"]>("viewer")
  const [newDept,       setNewDept]       = useState("")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const toggleNotification = (id: string, channel: "email" | "push" | "sms") => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n))
    )
  }

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase()

  const openEditUser = (user: UserType) => {
    setEditingUser(user)
    setEditForm({
      name:       user.name,
      email:      user.email,
      role:       user.role,
      department: user.department,
      status:     user.status,
    })
    setEditUserOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingUser || !editForm) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id ? { ...u, ...editForm } : u
      )
    )
    setEditUserOpen(false)
    setEditingUser(null)
    setEditForm(null)
  }

  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim()) return
    const newUser: UserType = {
      id:          `u${Date.now()}`,
      name:        newName.trim(),
      email:       newEmail.trim(),
      role:        newRole,
      department:  newDept.trim() || "—",
      status:      "pending",
      lastActive:  new Date().toISOString(),
      permissions: [],
    }
    setUsers((prev) => [...prev, newUser])
    setNewName(""); setNewEmail(""); setNewRole("viewer"); setNewDept("")
    setAddUserOpen(false)
  }

  const fieldSetter = (k: keyof EditUserForm) => (v: string) =>
    setEditForm((f) => f ? { ...f, [k]: v } : f)

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-[1600px] mx-auto">
      <div className="space-y-4 sm:space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            Manage users, permissions, and system preferences
          </p>
        </div>

        {/* ── Edit User Dialog ── */}
        <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update the user's information and permissions.</DialogDescription>
            </DialogHeader>
            {editForm && (
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={editForm.name} onChange={(e) => fieldSetter("name")(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={editForm.email} onChange={(e) => fieldSetter("email")(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={editForm.role} onValueChange={(v) => fieldSetter("role")(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={editForm.status} onValueChange={(v) => fieldSetter("status")(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input value={editForm.department} onChange={(e) => fieldSetter("department")(e.target.value)} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditUserOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-muted/50 w-full sm:w-auto flex overflow-x-auto">
            <TabsTrigger value="users"         className="flex-1 sm:flex-initial data-[state=active]:bg-background gap-2">
              <Users className="h-4 w-4 hidden sm:block" />Users
            </TabsTrigger>
            <TabsTrigger value="profile"       className="flex-1 sm:flex-initial data-[state=active]:bg-background gap-2">
              <User  className="h-4 w-4 hidden sm:block" />Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 sm:flex-initial data-[state=active]:bg-background gap-2">
              <Bell  className="h-4 w-4 hidden sm:block" />Notifications
            </TabsTrigger>
            <TabsTrigger value="security"      className="flex-1 sm:flex-initial data-[state=active]:bg-background gap-2">
              <Shield className="h-4 w-4 hidden sm:block" />Security
            </TabsTrigger>
          </TabsList>

          {/* ── Users Tab ── */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex flex-1 gap-3">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[130px]"><SelectValue placeholder="Filter role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add User Dialog */}
              <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shrink-0">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add User</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Invite a new team member to the platform.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Enter full name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="Enter email address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={newRole} onValueChange={(v) => setNewRole(v as UserType["role"])}>
                        <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="operator">Operator</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input placeholder="Enter department" value={newDept} onChange={(e) => setNewDept(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddUserOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddUser}>Send Invite</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {["User","Role","Department","Status","Last Active","Actions"].map((h, i) => (
                          <th key={h} className={cn("text-xs font-medium text-muted-foreground px-4 py-3", i === 5 ? "text-right" : "text-left")}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary" className={cn("font-medium", roleConfig[user.role].bgColor, roleConfig[user.role].color)}>
                              {roleConfig[user.role].label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">{user.department}</td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary" className={cn("font-medium", statusConfig[user.status].bgColor, statusConfig[user.status].color)}>
                              {statusConfig[user.status].label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {format(new Date(user.lastActive), "MMM d, HH:mm")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditUser(user)}>
                                  <Edit2 className="mr-2 h-4 w-4" />Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Key className="mr-2 h-4 w-4" />Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setUsers((prev) => prev.filter((u) => u.id !== user.id))}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditUser(user)}>
                            <Edit2 className="mr-2 h-4 w-4" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setUsers((prev) => prev.filter((u) => u.id !== user.id))}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="secondary" className={cn("font-medium", roleConfig[user.role].bgColor, roleConfig[user.role].color)}>
                        {roleConfig[user.role].label}
                      </Badge>
                      <Badge variant="secondary" className={cn("font-medium", statusConfig[user.status].bgColor, statusConfig[user.status].color)}>
                        {statusConfig[user.status].label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{user.department}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ── Profile Tab ── */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Information</CardTitle>
                <CardDescription>Update your personal information and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input id="profile-name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input id="profile-email" type="email" defaultValue="john.doe@sinokor.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Phone</Label>
                    <Input id="profile-phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-department">Department</Label>
                    <Input id="profile-department" defaultValue="Operations" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="profile-timezone">Timezone</Label>
                    <Select defaultValue="sgt">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (GMT +0:00)</SelectItem>
                        <SelectItem value="est">Eastern Time (GMT -5:00)</SelectItem>
                        <SelectItem value="pst">Pacific Time (GMT -8:00)</SelectItem>
                        <SelectItem value="cet">Central European (GMT +1:00)</SelectItem>
                        <SelectItem value="sgt">Singapore (GMT +8:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Notifications Tab ── */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive alerts and updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="hidden sm:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left text-sm font-medium text-foreground py-3">Category</th>
                        {[{ icon: Mail, label: "Email" }, { icon: Smartphone, label: "Push" }, { icon: MessageSquare, label: "SMS" }].map(({ icon: Icon, label }) => (
                          <th key={label} className="text-center text-sm font-medium text-foreground py-3 w-20">
                            <div className="flex items-center justify-center gap-1">
                              <Icon className="h-4 w-4" />
                              <span className="hidden lg:inline">{label}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {notifications.map((s) => (
                        <tr key={s.id}>
                          <td className="py-4 text-sm text-foreground">{s.category}</td>
                          <td className="py-4 text-center"><Switch checked={s.email} onCheckedChange={() => toggleNotification(s.id, "email")} /></td>
                          <td className="py-4 text-center"><Switch checked={s.push}  onCheckedChange={() => toggleNotification(s.id, "push")}  /></td>
                          <td className="py-4 text-center"><Switch checked={s.sms}   onCheckedChange={() => toggleNotification(s.id, "sms")}   /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="sm:hidden space-y-4">
                  {notifications.map((s) => (
                    <div key={s.id} className="border rounded-lg p-4 space-y-3">
                      <p className="font-medium text-sm">{s.category}</p>
                      <div className="grid grid-cols-3 gap-3">
                        {(["email","push","sms"] as const).map((ch) => (
                          <div key={ch} className="flex flex-col items-center gap-1">
                            <Switch checked={s[ch]} onCheckedChange={() => toggleNotification(s.id, ch)} />
                            <span className="text-xs text-muted-foreground capitalize">{ch}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Security Tab ── */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Password</CardTitle>
                <CardDescription>Change your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="current-password">Current Password</Label><Input id="current-password" type="password" /></div>
                <div className="space-y-2"><Label htmlFor="new-password">New Password</Label><Input id="new-password" type="password" /></div>
                <div className="space-y-2"><Label htmlFor="confirm-password">Confirm New Password</Label><Input id="confirm-password" type="password" /></div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-status-approved/10">
                      <Shield className="h-5 w-5 text-status-approved" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Authenticator App</p>
                      <p className="text-xs text-muted-foreground">Use an authenticator app to generate codes</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-status-approved/10 text-status-approved w-fit">Enabled</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Sessions</CardTitle>
                <CardDescription>Manage your active login sessions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-status-approved" />
                    <div>
                      <p className="text-sm font-medium">Chrome on MacOS</p>
                      <p className="text-xs text-muted-foreground">Singapore — Current session</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Safari on iPhone</p>
                      <p className="text-xs text-muted-foreground">Singapore — Last active 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
