import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CProductService } from "../services/CProducts.service";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../enums/errorType.enum";
import { getRepository } from "typeorm";
import { CProductEntity } from "../db/entities/CProducts.entities";

const productService = new CProductService();

export class CProductController {

  // Update product
  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new CCustomErrors(new Error("Invalid inputs"), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
      }

      const productId = req.params.productId;
      const updatedData = req.body;

      // Call the service to update the product by ID
      const updatedProduct = await productService.updateProductById(productId, updatedData);

      if (updatedProduct) {
        return res.status(200).json({
          status: 200,
          message: "Product updated successfully",
          data: updatedProduct
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Product not found"
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  // Delete product
  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.productId;

      // Call the service to delete the product by ID
      const isDeleted = await productService.deleteProductById(productId);

      if (isDeleted) {
        return res.status(200).json({
          status: 200,
          message: "Product deleted successfully"
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Product not found"
        });
      }
    } catch (error) {
      return next(error);
    }
  }

  // Add product
  static async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new CCustomErrors(new Error("Invalid inputs"), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
      }

      // Extract product data from request body
      const productData = req.body;

      productData.name = req.body.name;
      productData.description = req.body.description;
      productData.price = req.body.price;
      productData.quantity = req.body.quantity;
      productData.stock = req.body.stock;              
      productData.category = req.body.category;        
      productData.keywords = req.body.keywords;              
      productData.shop_id = req.body.shop_id;          
      productData.unit_id = req.body.unit_id;          

      productData.created_by = req.body.created_by;    
      productData.updated_by = req.body.updated_by;    

      // Call the service to add the product
      const savedProduct = await productService.addProduct(productData);

      return res.status(201).json({
        status: 201,
        message: "Product added successfully",
        data: savedProduct
      });
    } catch (error) {
      return next(error);
    }
  }

  // Get product by name
  static async getProductDetailsByName(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new CCustomErrors(new Error("Invalid inputs"), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
      }

      const productName = req.params.productName;
      const product = await productService.getProductDetailsByName(productName);

      if (product) {
        return res.status(200).json({ status: 200, data: product });
      } else {
        return res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      return next(error);
    }
  }

  // Filter products by category and price range
  static async filterProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, minPrice, maxPrice } = req.query;

      // Convert prices to numbers since query params are strings
      const minPriceNum = minPrice ? parseFloat(minPrice as string) : undefined;
      const maxPriceNum = maxPrice ? parseFloat(maxPrice as string) : undefined;

      const productRepository = getRepository(CProductEntity);
      
      // Create query options
      const whereConditions: any = {};
      if (category) {
        whereConditions.category = category;
      }
      if (minPriceNum !== undefined) {
        whereConditions.price = whereConditions.price || {};
        whereConditions.price.$gte = minPriceNum; 
      }
      if (maxPriceNum !== undefined) {
        whereConditions.price = whereConditions.price || {};
        whereConditions.price.$lte = maxPriceNum; 
      }
      // Fetch filtered products
      const products = await productRepository.find({ where: whereConditions });

      return res.status(200).json({
        status: 200,
        data: products
      });
    } catch (error) {
      return next(error);
    }
  }




  // Patch product (update quantity and price)
  static async patchProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new CCustomErrors(new Error("Invalid inputs"), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
      }

      const productId = req.params.productId;
      const { quantity, price } = req.body;

      if (quantity === undefined && price === undefined) {
        return res.status(400).json({
          status: 400,
          message: "At least one of 'quantity' or 'price' must be provided",
        });
      }

      const updatedProduct = await productService.patchProductById(productId, { quantity, price });

      if (updatedProduct) {
        return res.status(200).json({
          status: 200,
          message: "Product updated successfully",
          data: updatedProduct,
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Product not found",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
}













































// import { Request, Response, NextFunction, RequestHandler } from "express";
// import { validationResult } from "express-validator";
// import { CProductService } from "../services/CProducts.service";
// import { CCustomErrors } from "../helpers/CCustomErrors.helper";
// import { errorTypeEnum } from "../enums/errorType.enum";
// import { ParsedQs } from 'qs';


// const productService = new CProductService();

// export class CProductController {
//     static updateProduct(req, res) {res.send("Product updated successfully!");}
//     static deleteProduct(req, res) { res.send("Product deleted successfully!");}
  

//   // Add product
//   static async addProduct(req: Request, res: Response, next: NextFunction) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return next(new CCustomErrors(new Error("Invalid inputs"), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
//       }

//       const productData = req.body;
//       const savedProduct = await productService.addProduct(productData);
      
//       return res.status(201).json({
//         status: 201,
//         message: "Product added successfully",
//         data: savedProduct
//       });
//     } catch (error) {
//       return next(error);
//     }
//   }

//   // Get product by name
//   static async getProductDetailsByName(req: Request, res: Response, next: NextFunction) {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return next(new CCustomErrors(new Error("Invalid inputs"), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
//       }

//       const productName = req.params.productName;
//       const product = await productService.getProductDetailsByName(productName);

//       if (product) {
//         return res.status(200).json({ status: 200, data: product });
//       } else {
//         return res.status(404).json({ message: "Product not found" });
//       }
//     } catch (error) {
//       return next(error);
//     }
//   }


//   // Added filter product method 
// static async filterProducts(req: Request, res: Response, next: NextFunction) {
//   try {
//       const { category, minPrice, maxPrice } = req.query;
//       const products = await productService.filterProducts(category, minPrice, maxPrice);
      
//       return res.status(200).json({
//           status: 200,
//           data: products
//       });
//   } catch (error) {
//       return next(error);
//   }
// }
// }
