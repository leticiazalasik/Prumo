import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUsuariosUsuario20260827150000 implements MigrationInterface {
  name = 'RemoveUsuariosUsuario20260827150000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Usuarios" DROP CONSTRAINT "uq_usuario";
    `);
    await queryRunner.query(`
      ALTER TABLE "Usuarios" DROP COLUMN "usuario";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "Usuarios" ADD COLUMN "usuario" varchar(50);
    `);
    await queryRunner.query(`
      UPDATE "Usuarios" SET "usuario" = 'usuario_' || "id" WHERE "usuario" IS NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE "Usuarios" ALTER COLUMN "usuario" SET NOT NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE "Usuarios" ADD CONSTRAINT "uq_usuario" UNIQUE ("usuario");
    `);
  }
}
