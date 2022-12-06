// import { Generated } from 'kysely'
  
export interface ProductTable {
	id?: number,
	title: string,
	price: number,
	content: string,
	type: string,
	salesStartsAt: Date,
	salesEndsAt: Date,
	createdAt: Date,
	updatedAt: Date,
}
  
export interface Database {
	product: ProductTable
}
