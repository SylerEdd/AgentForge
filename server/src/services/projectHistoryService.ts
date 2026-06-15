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
