import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUsuariosAtivoNotNull20260827140000 implements MigrationInterface {
  name = 'AlterUsuariosAtivoNotNull20260827140000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "Usuarios" SET "ativo" = true WHERE "ativo" IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "Usuarios" ALTER COLUMN "ativo" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Usuarios" ALTER COLUMN "ativo" DROP NOT NULL;
    `);
  }
}
