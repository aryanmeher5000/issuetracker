-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_assignedToUserId_fkey";

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
