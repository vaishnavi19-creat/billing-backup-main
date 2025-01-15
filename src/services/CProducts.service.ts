import { CProductEntity } from "../db/entities/CProducts.entities";
import { getRepository } from "typeorm";

export class CProductService {
  // Add a new product
  async addProduct(productData: any): Promise<CProductEntity> {
    const productRepository = getRepository(CProductEntity);
    
    // Save the product details in the database
    const savedProduct = await productRepository.save(productData);
    return savedProduct;
  }

  // Fetch product details by name
  async getProductDetailsByName(productName: string): Promise<CProductEntity | null> {
    const productRepository = getRepository(CProductEntity);
    const product = await productRepository.findOne({ where: { name: productName } });
    return product;
  }

  // Update product by ID
  async updateProductById(productId: string, updatedData: Partial<CProductEntity>): Promise<CProductEntity | null> {
    const productRepository = getRepository(CProductEntity);
    
    // Convert productId to a number if necessary
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return null;
    }

    Object.assign(product, updatedData);

    // Save the updated product details
    const updatedProduct = await productRepository.save(product);
    return updatedProduct;
  }

  // Delete product by ID
  async deleteProductById(productId: string): Promise<boolean> {
    const productRepository = getRepository(CProductEntity);

    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

    const result = await productRepository.delete({ id });

    // Return true if the product was deleted, false otherwise
    return result.affected !== 0;
  }


  //patch method
  async patchProductById(productId: string, updatedFields: { quantity?: number | string; price?: number | string }): Promise<CProductEntity | null> {
    const productRepository = getRepository(CProductEntity);

    // Convert productId to a number before querying if necessary
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

    const product = await productRepository.findOne({ where: { id } });

    if (!product) {
      return null;
    }

    // Convert 'quantity' and 'price' to numbers if they are strings
    if (updatedFields.quantity !== undefined) {
      product.quantity = typeof updatedFields.quantity === 'string' ? parseInt(updatedFields.quantity, 10) : updatedFields.quantity;
    }
    if (updatedFields.price !== undefined) {
      product.price = typeof updatedFields.price === 'string' ? parseFloat(updatedFields.price) : updatedFields.price;
    }

    const updatedProduct = await productRepository.save(product);
    return updatedProduct;
  }

}





























// import { CProductEntity } from "../db/entities/CProducts.entities";
// import { UnitConversion } from "../db/entities/UnitConversion.entities";
// import { UnitTypeEntities } from "../db/entities/UnitType.entities";
// import { getRepository } from "typeorm";


// export class CProductService {
//   [x: string]: any;
//   async addProduct(productData: any): Promise<CProductEntity> {
//     const productRepository = getRepository(CProductEntity);
    
//     // Save the product details in the database
//     const savedProduct = await productRepository.save(productData);
//     return savedProduct;
//   }

//   // Fetch product details by name
//   async getProductDetailsByName(productName: string): Promise<CProductEntity | null> {
//     const productRepository = getRepository(CProductEntity);
//     const product = await productRepository.findOne({ where: { name: productName } });
//     return product;
//   }


// }
