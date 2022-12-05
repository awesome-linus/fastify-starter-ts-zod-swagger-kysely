import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { productSchemas } from "./schema/product";
import { fastifySwagger }from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;


// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Place here your custom code!
  for (const schema of productSchemas) {
    fastify.addSchema(schema);
  }

  void fastify.register(
    fastifySwagger, 
    withRefResolver({
      openapi: {
        info: {
          title: "Sample API using Fastify and Zod.",
          description:
            "ZodのバリデーションスキーマからリッチなOpenAPI仕様を出力するサンプル",
          version: "1.0.0",
        },
      },
    })
  );

  fastify.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    staticCSP: true,
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

};

export default app;
export { app, options }
