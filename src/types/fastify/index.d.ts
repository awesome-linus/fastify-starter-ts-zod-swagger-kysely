import { FastifyInstance } from "fastify";
import { Database } from '../../schema/kysely'
import { Kysely } from 'kysely'

declare module "fastify" {
  export interface FastifyInstance {
    db: Kysely<Database>;
  }
}
