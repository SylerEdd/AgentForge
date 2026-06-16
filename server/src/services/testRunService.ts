import { prisma } from "../lib/prisma.js";

type SaveTestRunInput = {
  projectId: string;
  success: boolean;
  output: string;
};

export async function saveTestRun(input: SaveTestRunInput) {
  return prisma.testRun.create({
    data: {
      projectId: input.projectId,
      success: input.success,
      output: input.output,
    },
  });
}

export async function getTestRunsForProject(projectId: string) {
  return prisma.testRun.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
