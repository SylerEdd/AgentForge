import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

type SaveGeneratedProjectInput = {
  idea: string;
  requirements: string[];
  classes: string[];
  code: string;
  tests: string;
  review: string[];
};

export async function saveGeneratedProject(input: SaveGeneratedProjectInput) {
  return prisma.project.create({
    data: {
      idea: input.idea,
      requirements: input.requirements as Prisma.InputJsonArray,
      classes: input.classes as Prisma.InputJsonArray,
      code: input.code,
      tests: input.tests,
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
