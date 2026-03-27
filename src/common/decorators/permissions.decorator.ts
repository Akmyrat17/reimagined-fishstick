import { SetMetadata } from "@nestjs/common"

export const PERMISSIONS = 'permissions'
export const Permissions = (...permissions: String[]) => SetMetadata(PERMISSIONS, permissions)