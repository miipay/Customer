import { MigrationInterface, QueryRunner } from "typeorm";

export class makeWorkflowIdUnique1669102261789 implements MigrationInterface {
    name = 'makeWorkflowIdUnique1669102261789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`individual_customer_review\` ADD UNIQUE INDEX \`IDX_1477b44164002e06cfbc40fb8f\` (\`workflowId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`individual_customer_review\` DROP INDEX \`IDX_1477b44164002e06cfbc40fb8f\``);
    }

}
