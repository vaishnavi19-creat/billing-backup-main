import { IProduct } from "../../interfaces/CProducts.interface";
import { getRepository } from "typeorm";
import { CProductEntity } from "../entities/CProducts.entities";
import { CCustomErrors } from "../../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../../enums/errorType.enum";

export class CProductModel {
    async addProduct(productData: IProduct): Promise<CProductEntity> {
        const productRepository = getRepository(CProductEntity);
        try {
            // Save the product details in the database
            const newProduct = productRepository.create(productData);
            const savedProduct = await productRepository.save(newProduct);
            return savedProduct;
            
        } catch (error) {
            throw new CCustomErrors(new Error("Error adding product"), errorTypeEnum.DATABASE_ERROR);
        }
    }
    
    async getProductDetailsByName(productName: string): Promise<CProductEntity | null> {
        const productRepository = getRepository(CProductEntity);
        try {
            const product = await productRepository.findOne({
                where: { name: productName },
                relations: ['shop', 'unit'],
            });
            return product;
        } catch (error) {
            throw new CCustomErrors(new Error("Error fetching product by name"), errorTypeEnum.DATABASE_ERROR);
        }
    }
}

















































































// import { IProduct } from "../../interfaces/CProducts.interface";
// import { getRepository } from "typeorm";
// import { CProductEntity } from "../entities/CProducts.entities";
// import { UnitTypeEntities } from "../entities/UnitType.entities";
// import { CShopEntities } from "../entities/CShop.entities";
// import { CCustomErrors } from "../../helpers/CCustomErrors.helper";
// import { errorTypeEnum } from "../../enums/errorType.enum";

// export class CProductModel {
//   // Add a new product to the database
//   async addProduct(productData: IProduct): Promise<CProductEntity> {
//     const productRepository = getRepository(CProductEntity);
//     try {
//       // Save the product details in the database
//       const newProduct = productRepository.create(productData);
//       const savedProduct = await productRepository.save(newProduct);
//       return savedProduct;
//     } catch (error) {
//       throw new CCustomErrors(new Error("Error adding product"), errorTypeEnum.DATABASE_ERROR);
//     }
//   }

//   // Fetch product by name
//   async getProductDetailsByName(productName: string): Promise<CProductEntity | null> {
//     const productRepository = getRepository(CProductEntity);
//     try {
//       const product = await productRepository.findOne({
//         where: { name: productName },
//         relations: ['shop', 'unit'],  // Include related shop and unit details
//       });
//       return product;
//     } catch (error) {
//       throw new CCustomErrors(new Error("Error fetching product by name"), errorTypeEnum.DATABASE_ERROR);
//     }
//   }


  
// }
