export type Role = keyof typeof ROLES 
type Permission = (typeof ROLES)[Role][number]

const ROLES = {
    admin: [
        "view:projects",
        "create:projects",
        "update:projects",
        "delete:projects",
        "view:users",
        "create:users",
        "update:users",
        "delete:users",
        "view:events",
        "create:events",
        "update:events",
        "delete:events",
    ],
    editor: [
        "view:projects",
        "create:projects",
        "update:projects",
        "delete:projects",
        // "view:users",
        // "create:users",
        // "update:users",
        // "delete:users",
        "view:events",
        "create:events",
        "update:events",
        "delete:events",
    ],
    user: [
        // "view:projects",
        // "create:projects",
        // "update:projects",
        // "delete:projects",
        // "view:users",
        // "create:users",
        // "update:users",
        // "delete:users",
        "view:events",
        "create:events",
        "update:events",
        "delete:events",
    ],

} as const

let _authUser: { id: string; role: Role } | null = null;
// Setter for the current authenticated user
export function setAuthUser(user: { id: string; role: Role } | null) {
  _authUser = user;
}
export function getAuthUser() {
  return _authUser;
}
export function hasPermission(
    user: { id: string; role: Role },
    permission: Permission
) {
    return (ROLES[user.role] as readonly Permission[]).includes(permission)
}