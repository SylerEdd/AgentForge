import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type { GeneratedFile } from "../types/generatedProject.js";

type SaveGeneratedProjectInput = {
  idea: string;
  requirements: string[];
  classes: string[];
  sourceFiles: GeneratedFile[];
  testFiles: GeneratedFile[];
  review: string[];
};

export async function saveGeneratedProject(input: SaveGeneratedProjectInput) {
  return prisma.project.create({
    data: {
      idea: input.idea,
      requirements: input.requirements as Prisma.InputJsonArray,
      classes: input.classes as Prisma.InputJsonArray,
      sourceFiles: input.sourceFiles as unknown as Prisma.InputJsonArray,
      testFiles: input.testFiles as unknown as Prisma.InputJsonArray,
      review: input.review as Prisma.InputJsonArray,
    },
  });
}

export async function getAllProjects() {
  return prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteProjectById(id: string) {
  return prisma.project.delete({
    where: {
      id,
    },
  });
}

type UpdateProjectFilesInput = {
  id: string;
  sourceFiles: GeneratedFile[];
  testFiles: GeneratedFile[];
  review: string[];
};

export async function updateProjectFiles(input: UpdateProjectFilesInput) {
  return prisma.project.update({
    where: {
      id: input.id,
    },
    data: {
      sourceFiles: input.sourceFiles as unknown as Prisma.InputJsonArray,
      testFiles: input.testFiles as unknown as Prisma.InputJsonArray,
      review: input.review as Prisma.InputJsonArray,
    },
    include: {
      testRuns: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
