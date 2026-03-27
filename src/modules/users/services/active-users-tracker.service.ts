import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class ActiveUsersTracker {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    // async ping(sessionId: string) {
    //     const key = `active_users:${new Date().toISOString().slice(0, 16)}`; // "active_users:2026-03-25T14:30"
    //     const existing: string[] = await this.cacheManager.get(key) || [];

    //     if (!existing.includes(sessionId)) {
    //         existing.push(sessionId);
    //     }

    //     await this.cacheManager.set(key, existing, 60 * 60 * 1000); // TTL 1 hour — Redis auto-deletes
    // }

    // async getActiveCount() {
    //     const allSessions = new Set<string>();
    //     const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    //     for (let i = 0; i <= 60; i++) {
    //         const time = new Date(oneHourAgo.getTime() + i * 60 * 1000).toISOString().slice(0, 16);
    //         const key = `active_users:${time}`;
    //         const sessions: string[] = await this.cacheManager.get(key) || [];
    //         sessions.forEach(id => allSessions.add(id));
    //     }

    //     return { users: allSessions.size };
    // }
    async ping() {
        const key = `active_users:${new Date().toISOString().slice(0, 16)}`; // per minute bucket
        const count: number = await this.cacheManager.get(key) || 0;
        await this.cacheManager.set(key, count + 1, 2 * 60 * 60 * 1000); // TTL 2 hours
    }

    async getActiveCount() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        let total = 0;

        for (let i = 0; i <= 60; i++) {
            const time = new Date(oneHourAgo.getTime() + i * 60 * 1000).toISOString().slice(0, 16);
            const key = `active_users:${time}`;
            const count: number = await this.cacheManager.get(key) || 0;
            total += count;
        }

        return { users: total };
    }
}