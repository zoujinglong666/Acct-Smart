import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTimestamps1754876417861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 添加 createdAt 和 updatedAt 字段
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT NOW()
    `);

    // 为现有记录设置默认值
    await queryRunner.query(`
      UPDATE users 
      SET "createdAt" = NOW(), "updatedAt" = NOW() 
      WHERE "createdAt" IS NULL OR "updatedAt" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS "createdAt",
      DROP COLUMN IF EXISTS "updatedAt"
    `);
  }
}