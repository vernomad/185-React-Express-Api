export type Role = keyof typeof ROLES 
type Permission = (typeof ROLES)[Role][number]

const ROLES = {
    admin: [
        "view:projects",
        "create:projects",
        "update:projects",
        "delete:projects",
        // "view:stories",
        // "create:stories",
        // "update:stories",
        // "delete:stories",
        // "view:comments",
        // "create:comments",
        // "update:comments",
        // "delete:comments",
    ],
    editor: [
        "view:projects",
        "create:projects",
        "update:projects",
        "delete:projects",
        // "view:stories",
        // "create:stories",
        // "update:stories",
        // "delete:stories",
        // "view:comments",
        // "create:comments",
        // "update:comments",
        // "delete:comments",
    ],
    user: [
        "view:projects",
       // "create:projects",
        // "view:stories",
        // "create:stories",
        // "view:comments",
        // "create:comments",
    ],

} as const

export function hasPermission(
    user: { id: string; role: Role },
    permission: Permission
) {
    return (ROLES[user.role] as readonly Permission[]).includes(permission)
}