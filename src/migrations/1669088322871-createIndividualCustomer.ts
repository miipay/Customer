import { MigrationInterface, QueryRunner } from "typeorm";

export class createIndividualCustomer1669088322871 implements MigrationInterface {
    name = 'createIndividualCustomer1669088322871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`individual_customer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`country\` varchar(3) NOT NULL, \`idNumber\` varchar(64) NOT NULL, \`firstName\` varchar(64) NOT NULL, \`middleName\` varchar(64) NULL, \`lastName\` varchar(64) NULL, \`email\` varchar(320) NULL, \`mobilePhone\` varchar(15) NULL, \`phoneNumber\` varchar(15) NULL, \`enabled\` tinyint NOT NULL DEFAULT 1, \`approved\` tinyint NOT NULL DEFAULT 0, \`approvedDate\` datetime(6) NULL, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_fee7c53602b1989951984e045b\` (\`enabled\`), INDEX \`IDX_3e519b303e0ece4d60aff757f6\` (\`created\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`individual_customer_review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`workflowId\` varchar(256) NOT NULL, \`workflowURL\` varchar(2048) NOT NULL, \`reviewResult\` longtext NULL, \`finished\` tinyint NOT NULL DEFAULT 0, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`customerId\` int NULL, INDEX \`IDX_4f7edd4f1111199462ba344cc7\` (\`created\`), INDEX \`IDX_d2085db2d9ee229159d7e8d8fe\` (\`updated\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`individual_customer_review\` ADD CONSTRAINT \`FK_81b9af6c7fcb7689ff964307d96\` FOREIGN KEY (\`customerId\`) REFERENCES \`individual_customer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`individual_customer_review\` DROP FOREIGN KEY \`FK_81b9af6c7fcb7689ff964307d96\``);
        await queryRunner.query(`DROP INDEX \`IDX_d2085db2d9ee229159d7e8d8fe\` ON \`individual_customer_review\``);
        await queryRunner.query(`DROP INDEX \`IDX_4f7edd4f1111199462ba344cc7\` ON \`individual_customer_review\``);
        await queryRunner.query(`DROP TABLE \`individual_customer_review\``);
        await queryRunner.query(`DROP INDEX \`IDX_3e519b303e0ece4d60aff757f6\` ON \`individual_customer\``);
        await queryRunner.query(`DROP INDEX \`IDX_fee7c53602b1989951984e045b\` ON \`individual_customer\``);
        await queryRunner.query(`DROP TABLE \`individual_customer\``);
    }

}
