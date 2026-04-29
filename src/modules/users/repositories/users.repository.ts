import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../entities/users.entity';
import { LangEnum } from 'src/common/enums';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  constructor(private datasource: DataSource) { super(UsersEntity, datasource.createEntityManager()); }

  async getUserByEmail(email: string) {
    return await this.createQueryBuilder('users')
      .leftJoin('users.permissions', 'permissions')
      .select(['users.id', 'users.email', 'users.password', 'users.is_verified', 'users.fullname', 'users.role', 'users.is_blocked'])
      .addSelect(['permissions.id', 'permissions.name', 'permissions.description', 'permissions.type'])
      .where('users.email = :email', { email })
      .getOne();
  }

  async getProfile(id: number, lang: LangEnum) {
    return await this.createQueryBuilder('users')
      .leftJoin('users.profession', 'profession')
      .leftJoin('users.address', 'address')
      .leftJoin('users.tags', 'tags')
      .select(['users.id', 'users.fullname', 'users.email', 'users.age', 'users.password', 'users.created_at'])
      .addSelect([`profession.id`, `profession.name`])
      .addSelect(['address.id', 'address.province'])
      .addSelect([`tags.id`, `tags.name`])
      .where('users.id = :id', { id })
      .getOne();
  }

  async addRemovedNotification(userId: number, notificationId: number): Promise<void> {
    await this.createQueryBuilder()
      .update('users')
      .set({
        removed_notifications: () => `array_append(removed_notifications, ${notificationId})`
      })
      .where('id = :userId', { userId })
      .andWhere('NOT :notificationId = ANY(removed_notifications)', { notificationId })
      .execute();
  }

  async getEmailsByTagIds(tagIds: number[], exceptUserEmail: string) {
    // Use ANY($1) for cleaner array handling in PostgreSQL
    const sql = `
    SELECT DISTINCT u.email 
    FROM users u
    JOIN user_tags ut ON u.id = ut.user_id
    WHERE ut.tag_id = ANY($1) AND u.email <> $2
  `;

    try {
      const result = await this.query(sql, [tagIds, exceptUserEmail]);
      return result.map(row => row.email);
    } catch (error: any) {
      console.error("❌ Error fetching emails by tags:", error);
      return [];
    }
  }

  async getUserEmailById(id: number): Promise<string | null> {
    const result = await this.query(
      `SELECT email FROM users WHERE id = $1`,
      [id]
    );
    return result[0]?.email ?? null;
  }

  async getEmailsAll() {
    const sql = `
    SELECT DISTINCT u.email 
    FROM users u
  `;
    try {
      const result = await this.query(sql);
      return result.map(row => row.email);
    } catch (error: any) {
      console.error("❌ Error fetching emails by tags:", error);
      return [];
    }
  }

  async getToDeleteProfile(id: number) {
    return await this.createQueryBuilder('u')
      .leftJoin('u.questions', 'q')
      .leftJoin('u.answers', 'a')
      .select(['u.id'])
      .addSelect(['a.id', 'a.content'])
      .addSelect('q.id')
      .where('u.id = :id', { id })
      .getOne()
  }

}

