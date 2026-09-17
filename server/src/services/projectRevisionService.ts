import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { GeneratedFile } from "../types/generatedProject.js";

type SaveProjectRevisionInput = {
  projectId: string;
  sourceFiles: GeneratedFile[];
  testFiles: GeneratedFile[];
  review: string[];
  changeSummary: string[];
};

export async function saveProjectRevision(input: SaveProjectRevisionInput) {
  return prisma.$transaction(async (transaction) => {
    // Save the new revision
    const latestRevision = await transaction.projectRevision.findFirst({
      where: {
        projectId: input.projectId,
      },
      orderBy: {
        version: "desc",
      },
    });

    const nextVersion = latestRevision ? latestRevision.version + 1 : 1;

    return transaction.projectRevision.create({
      data: {
        projectId: input.projectId,
        sourceFiles: input.sourceFiles as unknown as Prisma.InputJsonArray,
        testFiles: input.testFiles as unknown as Prisma.InputJsonArray,
        review: input.review as Prisma.InputJsonArray,
        changeSummary: input.changeSummary as Prisma.InputJsonArray,
        version: nextVersion,
      },
    });
  });
}

export async function getProjectRevisions(projectId: string) {
  return prisma.projectRevision.findMany({
    where: {
      projectId,
    },
    orderBy: {
      version: "desc",
    },
  });
}
