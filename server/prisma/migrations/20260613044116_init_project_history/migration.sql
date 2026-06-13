-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "idea" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "classes" JSONB NOT NULL,
    "code" TEXT NOT NULL,
    "tests" TEXT NOT NULL,
    "review" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
