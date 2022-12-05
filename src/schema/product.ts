import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export const ProductType = {
  book: "book",
  movie: "movie",
  game: "game",
} as const;

const productInput = {
  title: z.string().min(3).max(50).describe("製品登録名"),
  price: z.number().max(900000).default(100).describe("価格"),
  content: z.nullable(z.string()).optional().describe("内容"),
  type: z.nativeEnum(ProductType).describe("製品種別"),
  salesStartsAt: z.date().describe("販売開始日"),
  salesEndsAt: z.date().describe("販売終了日"),
};

const productGenerated = {
  id: z.string().uuid().describe("製品ID"),
  createdAt: z.date().describe("作成日"),
  updatedAt: z.date().describe("更新日"),
};

const createProductBodySchema = z.object({
  ...productInput,
});

const productResponseSchema = z
  .object({
    ...productInput,
    ...productGenerated,
  })
  .describe("Product response schema");

const getProductParamsSchema = z.object({
  id: productGenerated.id,
});
const getProductQuerySchema = z.object({
  title: z.optional(productInput.title),
  type: z.optional(z.array(productInput.type)),
});

export type CreateProductInput = z.infer<typeof createProductBodySchema>;
export type ProductOutput = z.infer<typeof productResponseSchema>;
export type GetProductParamsInput = z.infer<typeof getProductParamsSchema>;
export type GetProductQueryInput = z.infer<typeof getProductQuerySchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductBodySchema,
    productResponseSchema,
    getProductParamsSchema,
    getProductQuerySchema,
  },
  {
    $id: "productSchemas",
  }
);
