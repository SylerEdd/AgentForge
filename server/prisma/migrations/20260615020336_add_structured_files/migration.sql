/*
  Warnings:

  - You are about to drop the column `code` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `tests` on the `Project` table. All the data in the column will be lost.
  - Added the required column `sourceFiles` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testFiles` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "code",
DROP COLUMN "tests",
ADD COLUMN     "sourceFiles" JSONB NOT NULL,
ADD COLUMN     "testFiles" JSONB NOT NULL;
