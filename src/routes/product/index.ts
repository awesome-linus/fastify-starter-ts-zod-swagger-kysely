import { FastifyPluginAsync } from "fastify"
import { getProductHandler, createProductHandler } from "../../controller/product";
import { $ref } from "../../schema/product";

const product: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/:id', {
    schema: {
      params: $ref("getProductParamsSchema"),
      querystring: $ref("getProductQuerySchema"),
      response: {
        200: {
          ...$ref("productResponseSchema"),
          description: "取得成功",
        },
      },
      tags: ["Product"],
    },
    // handler: async function (request, reply) { 
    //   return 'this is an example'
    // }
    handler: getProductHandler,
  })

  fastify.post("/", {
    schema: {
      body: $ref("createProductBodySchema"),
      response: {
        201: { ...$ref("productResponseSchema"), description: "登録完了" },
      },
      tags: ["Product"],
    },
    handler: createProductHandler,
  });
}

export default product;
