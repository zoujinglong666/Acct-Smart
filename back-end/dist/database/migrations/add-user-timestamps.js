"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserTimestamps1754876417861 = void 0;
class AddUserTimestamps1754876417861 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT NOW()
    `);
        await queryRunner.query(`
      UPDATE users 
      SET "createdAt" = NOW(), "updatedAt" = NOW() 
      WHERE "createdAt" IS NULL OR "updatedAt" IS NULL
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS "createdAt",
      DROP COLUMN IF EXISTS "updatedAt"
    `);
    }
}
exports.AddUserTimestamps1754876417861 = AddUserTimestamps1754876417861;
//# sourceMappingURL=add-user-timestamps.js.map