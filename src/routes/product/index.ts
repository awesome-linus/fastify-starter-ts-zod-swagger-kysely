import { FastifyPluginAsync } from "fastify"
// import { v4 as uuidv4 } from "uuid";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  GetProductParamsInput,
  CreateProductInput,
  ProductType,
} from "../../schema/product";
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
    handler: async function (
      request: FastifyRequest<{ Params: GetProductParamsInput }>,
      reply: FastifyReply
    ) { 
        const id = request.params.id;

        const product = await fastify.db
        .selectFrom('product')
        .selectAll()
        .executeTakeFirst();
      
        console.log("=== proc");
        console.log(product);
        console.log(product?.title);
      
        console.log(`Fetching product( ${id} )...`);
      
        reply.code(200).send({
          id,
          title: "super product",
          price: 1000,
          content: "some content",
          type: ProductType.game,
          salesStartsAt: new Date(),
          salesEndsAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }
  })

  fastify.post("/", {
    schema: {
      body: $ref("createProductBodySchema"),
      response: {
        201: { ...$ref("productResponseSchema"), description: "登録完了" },
      },
      tags: ["Product"],
    },
    handler: async function (
      request: FastifyRequest<{ Body: CreateProductInput }>,
      reply: FastifyReply
    ) { 
      // const uuid = uuidv4();
      const createdAt = new Date();
      const updatedAt = new Date();
    
      console.log("Product created.");

      console.log('=== insert');
      const { id }= await fastify.db.insertInto("product").
        values({ 
          title: request.body.title, 
          price: request.body.price,
          content: request.body.content || "",
          type: request.body.type, 
          salesStartsAt: request.body.salesStartsAt, 
          salesEndsAt: request.body.salesEndsAt,
          createdAt,
          updatedAt,
        })
        // ここでIDを指定してもIDが返ってこない
        .returning("id")
        .executeTakeFirstOrThrow()

      console.log('=== insert done');
      console.log(id);

    
      reply.code(201).send({
        id: "11",
        title: request.body.title,
        price: request.body.price,
        content: request.body.content,
        type: request.body.type,
        salesStartsAt: request.body.salesStartsAt,
        salesEndsAt: request.body.salesEndsAt,
        createdAt,
        updatedAt,
      });
    }
  });
}

export default product;
