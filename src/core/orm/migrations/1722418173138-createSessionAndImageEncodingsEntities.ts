import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionAndImageEncodingsEntities1722418173138
  implements MigrationInterface
{
  name = 'CreateSessionAndImageEncodingsEntities1722418173138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session_entity" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "status" text NOT NULL, CONSTRAINT "PK_897bc09b92e1a7ef6b30cba4786" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "image_encoding_entity" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "image_url" text NOT NULL, "session_id" uuid NOT NULL, "image_name" text NOT NULL, "status" text NOT NULL, "error" jsonb, "encodings" jsonb, CONSTRAINT "PK_5c5e94dd8b7a8f8190b99d94f5d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "image_encoding_entity" ADD CONSTRAINT "FK_9660caf60d15d61703aae82e54a" FOREIGN KEY ("session_id") REFERENCES "session_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image_encoding_entity" DROP CONSTRAINT "FK_9660caf60d15d61703aae82e54a"`,
    );
    await queryRunner.query(`DROP TABLE "image_encoding_entity"`);
    await queryRunner.query(`DROP TABLE "session_entity"`);
  }
}
