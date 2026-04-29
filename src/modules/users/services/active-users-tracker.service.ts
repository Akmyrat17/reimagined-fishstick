import { Injectable, Inject } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class ActiveUsersTracker {

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async ping() {
        // Round down to nearest 10 minutes: 11:19 → "11:10", 11:25 → "11:20"
        const now = new Date();
        const minutes = Math.floor(now.getMinutes() / 10) * 10;
        const key = `active_users:${now.getHours().toString().padStart(2, '0')}-${minutes.toString().padStart(2, '0')}`;

        const count: number = await this.cacheManager.get(key) || 0;
        await this.cacheManager.set(key, count + 1, 60 * 60 * 1000); // TTL 1 hour
    }

    async getActiveCount() {
        const now = new Date();
        const buckets: { label: string; users: number }[] = [];
        let total = 0;

        // Go back 60 minutes, step by 10 minutes = 6 buckets + current = 7 buckets
        for (let i = 60; i >= 0; i -= 10) {
            const bucketTime = new Date(now.getTime() - i * 60 * 1000);
            const hours = bucketTime.getHours().toString().padStart(2, '0');
            const minutes = (Math.floor(bucketTime.getMinutes() / 10) * 10).toString().padStart(2, '0');

            const key = `active_users:${hours}-${minutes}`;
            const count: number = await this.cacheManager.get(key) || 0;

            total += count;
            buckets.push({
                label: `${hours}:${minutes}`,
                users: count,
            });
        }

        return { total, buckets };
    }
}