// src/config/typeorm.seeder.ts
import { config as dotenvConfig } from 'dotenv';
import { DataSource } from "typeorm";

dotenvConfig({ path: '.env' });

export const seederDataSource = new DataSource({
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: parseInt(process.env.DATABASE_PORT!),
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: ["src/modules/**/entities/*.entity.ts"], // TypeScript entities for seeders
    synchronize: false,
});