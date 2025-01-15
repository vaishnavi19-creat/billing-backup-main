import { CBaseRouter } from "./CBase.router";
import { CProductController } from "../controllers/CProducts.controller";
import { CProductValidator } from "../validators/CProducts.validator";

class CProductRouter extends CBaseRouter {
    constructor() {
        super();
        this.getRoutes();
        this.postRoutes();
        this.putRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }

    getRoutes() {
        console.log('In getRoute() from CProductRouter');
        // validation name
        this.router.get('/product/:getProductDetailsByName', CProductValidator.validateProductsByName(), CProductController.getProductDetailsByName);
    }

    postRoutes() {
        console.log('In postRoute() from CProductRouter');
        // Add a new product - validation required
        this.router.post('/product', CProductValidator.validateProduct(), CProductController.addProduct);
        this.router.post('/product', CProductController.filterProduct);
    }

    putRoutes() {
        console.log('In putRoute() from CProductRouter');
        // Update product details - validation required
        this.router.put('/product', CProductValidator.validateProduct(), CProductController.updateProduct);
    }
    
    patchRoutes() {
        console.log('In patchRoute() from CProductRouter');
        // Partially update product details - validation required
        this.router.patch('/product/:ProductId', CProductValidator.validatepatchProduct(), CProductController.patchProduct);
    }

    deleteRoutes() {
        console.log('In deleteRoute() from CProductRouter');
        this.router.delete('/product', CProductController.deleteProduct);
    }
}

export default new CProductRouter().router;








































// import { CBaseRouter } from "./CBase.router";
// import { CProductController } from "../controllers/CProducts.controller";
// import { CProductValidator } from "../validators/CProducts.validator";




// class CProductRouter extends CBaseRouter {

//     constructor() {
//         super();
//         this.getRoutes();
//         this.postRoutes();
//         this.putRoutes();
//         this.patchRoutes();
//         this.deleteRoutes();
//     }

//     getRoutes() {
//         console.log('In getRoute() from CProductRouter');
//         this.router.get('/product/:getProductDetailsByName', CProductValidator.validateProductsByName(), CProductController.getProductDetailsByName); 

//     }

//     postRoutes() {
//         console.log('In postRoute() from CProductRouter');
//             this.router.post('/product', CProductValidator.validateProduct(), CProductController.addProduct);
//             this.router.post('/product', CProductValidator.validateFilterProduct(), CProductController.filterProduct);

//     }

//     putRoutes() {
//         console.log('In putRoute() from CProductRouter');
//         this.router.put('/product', CProductValidator.validateProduct(), CProductController.updateProduct);
//     }
    
//     patchRoutes() {
//         console.log('In patchRoute() from CSignUpRouter');
//         this.router.patch('/product/:ProductId', CProductValidator.validatepatchProduct(), CProductController.patchProduct);

//     }

//     deleteRoutes() {
//         console.log('In deleteRoute() from CProductRouter');  
//         // DELETE route for deleting product (both new and old)
//         this.router.delete('/product', CProductValidator.validateProduct(), CProductController.deleteProduct);

//     }   
// }

// export default new CProductRouter().router;






















