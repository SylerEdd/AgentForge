-- CreateTable
CREATE TABLE "TestRun" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "output" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
