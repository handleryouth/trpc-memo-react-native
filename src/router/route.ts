import z from "zod";
import { PrismaClient } from "@prisma/client";
import { createRouter } from "../utils";

const prisma = new PrismaClient();

export const createMemo = createRouter()
  .query("getAllMemo", {
    resolve: async () => {
      const data = await prisma.memo.findMany();
      const totalData = await prisma.memo.count();
      if (data) {
        return {
          data,
          totalData,
        };
      } else {
        return "No data";
      }
    },
  })
  .query("getSpecificMemo", {
    input: z.string(),
    resolve: async (req) => {
      const data = await prisma.memo.findUnique({
        where: {
          id: req.input,
        },
      });
      return data;
    },
  })
  .mutation("createMemo", {
    input: z.object({
      title: z.string(),
      content: z.string(),
    }),
    resolve: async (req) => {
      await prisma.memo.create({
        data: {
          content: req.input.content,
          title: req.input.title,
        },
      });
      return "success";
    },
  })
  .mutation("updateMemo", {
    input: z.object({
      id: z.string(),
      content: z.string().optional(),
      title: z.string().optional(),
    }),
    resolve: async (req) => {
      const originalData = await prisma.memo.findUnique({
        where: {
          id: req.input.id,
        },
      });

      if (originalData) {
        await prisma.memo.update({
          where: {
            id: req.input.id,
          },
          data: {
            content: req.input.content || originalData.content,
            title: req.input.title || originalData.title,
          },
        });
      }

      return "success";
    },
  })
  .mutation("deleteMemo", {
    input: z.object({
      id: z.array(z.string()),
    }),
    resolve: async (req) => {
      await prisma.memo.deleteMany({
        where: {
          id: {
            in: req.input.id,
          },
        },
      });

      return "success";
    },
  });
