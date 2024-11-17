type Role = keyof typeof ROLES
type Permissions = (typeof ROLES)[Role][number]

const ROLES = {
  admin: [
    "view:user",
    "create:user",
    "edit:user",
    "delete:user",
  ],
  editor: [
    "view:user",
    "create:user",
    "edit:user",
  ],
  user: [
    "view:user",
    "create:user",
  ]
}

export function hasPermissions(
  user: { id: string; role: Role },
  permissions: Permissions
) {
  return (ROLES[user.role] as readonly Permissions[]).includes(permissions)
}