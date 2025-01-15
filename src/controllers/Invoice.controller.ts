import * as express from "express";
import { validationResult } from "express-validator";
import { errorTypeEnum } from "../enums/errorType.enum";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { createInvoiceReq } from "../interfaces/Invoice.interface";
import { InvoiceService } from "../services/Invoice.services";
import { InvoiceEntities } from "../db/entities/Invoice.entities";
import { getRepository } from "typeorm";

const objInvoiceService = new InvoiceService();

export class InvoiceController {
   
    static async createInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            console.log('In createInvoice() from InvoiceController');
            const errors = validationResult(request);
    
            if (!errors.isEmpty()) {
                console.log('Caught in input validation error from InvoiceController => createInvoice()');
                return next(new CCustomErrors(new Error('Please provide valid inputs.'), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
            }
    
            const objFilteredInvoice: createInvoiceReq = request.body; 
    
            // Call the service to create the invoice
            const objSavedInvoice = await objInvoiceService.createInvoice(objFilteredInvoice);
            
            // Discount related operations - Here we can apply any discount logic after invoice creation
            // For example, applying a percentage discount to the total amount
            if (objSavedInvoice) {
                console.log('Applying discount after invoice creation');
                
                // Corrected: Call applyDiscount from the service, not the controller
                const discountAmount = await objInvoiceService.applyDiscount(objSavedInvoice.amount, request.body.discountType, request.body.discount);
    
                objSavedInvoice.totalAmount -= discountAmount; // Subtracting the discount from the total amount
                
                console.log('Invoice with discount applied:', objSavedInvoice);
    
                console.log('Received success response in InvoiceController => createInvoice()');
                response.status(201).send({
                    status: 201,
                    message: 'Invoice created successfully with discount',
                    data: objSavedInvoice
                });
            }
        } catch (error) {
            return next(error);
        }
    }
    



    static async getInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const invoiceId = request.params.id;
            const invoice = await objInvoiceService.getInvoiceById(invoiceId);
            
            if (invoice) {
                console.log('Received success response in InvoiceController => getInvoice()');
                response.status(200).send({
                    status: 200,
                    message: 'Invoice fetched successfully',
                    data: invoice
                });
            } else {
                return next(new CCustomErrors(new Error('Invoice not found'), errorTypeEnum.NOT_FOUND_ERROR));
            }
        } catch (error) {
            return next(error);
        }
    }

    static async getAllInvoices(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const limit = request.query.limit ? (Array.isArray(request.query.limit) ? request.query.limit[0] : request.query.limit) : "10";
            const pageNumber = request.query.pageNumber ? (Array.isArray(request.query.pageNumber) ? request.query.pageNumber[0] : request.query.pageNumber) : "1";

            const parsedLimit = parseInt(limit as string);
            const parsedPageNumber = parseInt(pageNumber as string);
            
            const invoices = await objInvoiceService.getAllInvoices(parsedLimit, parsedPageNumber);

            console.log('Received success response in InvoiceController => getAllInvoices()');
            response.status(200).send({
                status: 200,
                message: 'Invoices fetched successfully',
                data: invoices.length > 0 ? invoices : []
            });
        } catch (error) {
            return next(error);
        }
    }

    static async deleteInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const invoiceId = request.params.id; 
            await objInvoiceService.deleteInvoice(invoiceId);

            console.log('Received success response in InvoiceController => deleteInvoice()');
            response.status(204).send(); 
        } catch (error) {
            return next(error);
        }
    }

    // Filter invoice by status
    static async filterInvoices(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            // Get the 'status' query parameter and ensure it's a string
            const { status } = request.query;

            const statusString = Array.isArray(status) ? status[0] : status;

            if (typeof statusString === 'string') {
                const invoices = await objInvoiceService.filterInvoices(statusString);
                
                console.log('Received success response in InvoiceController => filterInvoices()');
                return response.status(200).send({
                    status: 200,
                    message: 'Invoices filtered successfully',
                    data: invoices.length > 0 ? invoices : []
                });
            } else {
                return next(new CCustomErrors(new Error('Invalid status parameter'), errorTypeEnum.INPUT_VALIDATION_ERROR));
            }
        } catch (error) {
            return next(error);
        }
    }

    // Method to update invoice (PUT)
    static async updateInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const invoiceId = request.params.id;
            const objUpdatedInvoice: Partial<createInvoiceReq> = request.body; // Assuming body contains fields to update
            const updatedInvoice = await objInvoiceService.updateInvoice(invoiceId, objUpdatedInvoice);

            if (updatedInvoice) {
                console.log('Received success response in InvoiceController => updateInvoice()');
                response.status(200).send({
                    status: 200,
                    message: 'Invoice updated successfully',
                    data: updatedInvoice
                });
            } else {
                return next(new CCustomErrors(new Error('Invoice not found'), errorTypeEnum.NOT_FOUND_ERROR));
            }
        } catch (error) {
            return next(error);
        }
    }

    // Method to partially update invoice (PATCH)
    static async patchInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const invoiceId = request.params.id; 
            const data: Partial<InvoiceEntities> = request.body; 
    
            const updatedInvoice = await objInvoiceService.patchInvoice(invoiceId, data);
    
            if (updatedInvoice) {
                console.log('Received success response in InvoiceController => patchInvoice()');
                response.status(200).send({
                    status: 200,
                    message: 'Invoice updated successfully',
                    data: updatedInvoice
                });
            } else {
                return next(new CCustomErrors(new Error('Invoice not found'), errorTypeEnum.NOT_FOUND_ERROR));
            }
        } catch (error) {
            return next(error);
        }
    }
}






















































// import * as express from "express";
// import { validationResult } from "express-validator";
// import { errorTypeEnum } from "../enums/errorType.enum";
// import { CCustomErrors } from "../helpers/CCustomErrors.helper";
// import { createInvoiceReq } from "../interfaces/Invoice.interface";
// import { InvoiceService } from "../services/Invoice.services";
// import { InvoiceEntities } from "../db/entities/Invoice.entities";
// import { getRepository } from "typeorm";

// const objInvoiceService = new InvoiceService();

// export class InvoiceController {
   
//     static async createInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
//         try {
//             console.log('In createInvoice() from InvoiceController');
//             const errors = validationResult(request);

//             if (!errors.isEmpty()) {
//                 console.log('Caught in input validation error from InvoiceController => createInvoice()');
//                 return next(new CCustomErrors(new Error('Please provide valid inputs.'), errorTypeEnum.INPUT_VALIDATION_ERROR, errors));
//             }

//             const objFilteredInvoice: createInvoiceReq = request.body; 
//             const objSavedInvoice = await objInvoiceService.createInvoice(objFilteredInvoice);
            
//             if (objSavedInvoice) {
//                 console.log('Received success response in InvoiceController => createInvoice()');
//                 response.status(201).send({
//                     status: 201,
//                     message: 'Invoice created successfully',
//                     data: objSavedInvoice
//                 });
//             }
//         } catch (error) {
//             return next(error);
//         }
//     }

//     static async getInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
//         try {
//             const invoiceId = request.params.id;
//             const invoice = await objInvoiceService.getInvoiceById(invoiceId);
            
//             if (invoice) {
//                 console.log('Received success response in InvoiceController => getInvoice()');
//                 response.status(200).send({
//                     status: 200,
//                     message: 'Invoice fetched successfully',
//                     data: invoice
//                 });
//             } else {
//                 return next(new CCustomErrors(new Error('Invoice not found'), errorTypeEnum.NOT_FOUND_ERROR));
//             }
//         } catch (error) {
//             return next(error);
//         }
//     }

//     static async getAllInvoices(request: express.Request, response: express.Response, next: express.NextFunction) {
//         try {
//             const limit = request.query.limit ? (Array.isArray(request.query.limit) ? request.query.limit[0] : request.query.limit) : "10";
//             const pageNumber = request.query.pageNumber ? (Array.isArray(request.query.pageNumber) ? request.query.pageNumber[0] : request.query.pageNumber) : "1";

//             const parsedLimit = parseInt(limit as string);
//             const parsedPageNumber = parseInt(pageNumber as string);
            
//             const invoices = await objInvoiceService.getAllInvoices(parsedLimit, parsedPageNumber);

//             console.log('Received success response in InvoiceController => getAllInvoices()');
//             response.status(200).send({
//                 status: 200,
//                 message: 'Invoices fetched successfully',
//                 data: invoices.length > 0 ? invoices : []
//             });
//         } catch (error) {
//             return next(error);
//         }
//     }

//     static async deleteInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
//         try {
//             const invoiceId = request.params.id; 
//             await objInvoiceService.deleteInvoice(invoiceId);

//             console.log('Received success response in InvoiceController => deleteInvoice()');
//             response.status(204).send(); 
//         } catch (error) {
//             return next(error);
//         }
//     }


// //filter invoice
//     static async filterInvoices(request: express.Request, response: express.Response, next: express.NextFunction) {
//         try {
//             // Get the 'status' query parameter and ensure it's a string
//             const { status } = request.query;

//             const statusString = Array.isArray(status) ? status[0] : status;

//             if (typeof statusString === 'string') {
//                 const invoices = await objInvoiceService.filterInvoices(statusString);
                
//                 console.log('Received success response in InvoiceController => filterInvoices()');
//                 return response.status(200).send({
//                     status: 200,
//                     message: 'Invoices filtered successfully',
//                     data: invoices.length > 0 ? invoices : []
//                 });
//             } else {
//                 return next(new CCustomErrors(new Error('Invalid status parameter'), errorTypeEnum.INPUT_VALIDATION_ERROR));
//             }
//         } catch (error) {
//             return next(error);
//         }
//     }



//     // Method to update invoice (PUT)
//     static async updateInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
//         try {
//             const invoiceId = request.params.id;
//             const objUpdatedInvoice: Partial<createInvoiceReq> = request.body; // Assuming body contains fields to update
//             const updatedInvoice = await objInvoiceService.updateInvoice(invoiceId, objUpdatedInvoice);

//             if (updatedInvoice) {
//                 console.log('Received success response in InvoiceController => updateInvoice()');
//                 response.status(200).send({
//                     status: 200,
//                     message: 'Invoice updated successfully',
//                     data: updatedInvoice
//                 });
//             } else {
//                 return next(new CCustomErrors(new Error('Invoice not found'), errorTypeEnum.NOT_FOUND_ERROR));
//             }
//         } catch (error) {
//             return next(error);
//         }
//     }


//     // Method to partially update invoice (PATCH)
//     static async patchInvoice(request: express.Request, response: express.Response, next: express.NextFunction) {
//         try {
//             const invoiceId = request.params.id; 
//             const data: Partial<InvoiceEntities> = request.body; 
    
//             const updatedInvoice = await objInvoiceService.patchInvoice(invoiceId, data);
    
//             if (updatedInvoice) {
//                 console.log('Received success response in InvoiceController => patchInvoice()');
//                 response.status(200).send({
//                     status: 200,
//                     message: 'Invoice updated successfully',
//                     data: updatedInvoice
//                 });
//             } else {
//                 return next(new CCustomErrors(new Error('Invoice not found'), errorTypeEnum.NOT_FOUND_ERROR));
//             }
//         } catch (error) {
//             return next(error);
//         }
//     }
//     }







