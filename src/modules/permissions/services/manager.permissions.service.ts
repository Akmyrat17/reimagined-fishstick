import { In } from 'typeorm';
import { ManagerPermissionsRepository } from '../repositories/manager.permissions.repository';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as data from '../../../common/permissions.json'

@Injectable()
export class ManagerPermissionsService {
    private readonly logger = new Logger(ManagerPermissionsService.name);
    constructor(private permissionsRepository: ManagerPermissionsRepository) { }

    async refreshPermissions() {
        this.logger.warn("Warnigneng permisiano writtanos");
        try {
            const permissions = data.permissions;

            // Fetch all existing permission names in one query
            const existingPermissions = await this.permissionsRepository.find({
                where: {
                    name: In(permissions.map((permission) => permission.name)),
                },
            });

            // Get the names of the existing permissions
            const existingPermissionNames = new Set(
                existingPermissions.map((p) => p.name),
            );

            // Filter out permissions that already exist in the database
            const newPermissions = permissions.filter(
                (permission) => !existingPermissionNames.has(permission.name),
            );

            // Save all new permissions in one bulk insert operation
            if (newPermissions.length > 0) {
                await this.permissionsRepository.save(newPermissions);
            }
            this.logger.log("suksecino refrikado permisino");
            return {
                message: 'Permissions refreshed successfully',
            };
        } catch (error: any) {
            this.logger.error(error.detail ?? error.message);
            throw new BadRequestException(error.detail ?? error.message);
        }
    }

    async findAll() {
        const permissions = await this.permissionsRepository.find()
        return permissions
    }
}
