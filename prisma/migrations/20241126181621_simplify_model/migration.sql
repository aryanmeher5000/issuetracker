/*
  Warnings:

  - You are about to drop the column `tags` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the `ProjectMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectMember" DROP CONSTRAINT "ProjectMember_userId_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "tags",
ADD COLUMN     "admins" TEXT[],
ADD COLUMN     "members" TEXT[];

-- DropTable
DROP TABLE "ProjectMember";
