import * as express from "express";
import { RequestHandler } from "express-serve-static-core";
import { validationResult } from "express-validator";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { errorTypeEnum } from "../enums/errorType.enum";
import { VendorService } from "../services/Vendor.services";
import { VendorValidator } from "../validators/Vendor.validator";


const objVendorService = new VendorService();

export class VendorController {
    getVendor: any;
    deleteVendor: any;
    static async addVendor(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new CCustomErrors(new Error('Validation error'), errorTypeEnum.INPUT_VALIDATION_ERROR, errors.array()));
            }

            const vendorData = req.body;
            const savedVendor = await objVendorService.addNewVendor(vendorData);

            return res.status(200).send({
                status: 200,
                message: 'Vendor added successfully.',
                data: savedVendor,
            });
        } catch (error) {
            return next(error);
        }
    }

    static async getAllVendors(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const limit = Number(req.query.limit);
            const pageNumber = Number(req.query.pageNumber);
            const vendors = await objVendorService.getAllVendors(limit, pageNumber);

            return res.status(200).send({
                status: 200,
                message: 'success',
                data: vendors,
            });
        } catch (error) {
            return next(error);
        }
    }

    static async getVendorById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const vendorId = Number(req.params.vendorId);
            const vendor = await objVendorService.getVendorById(vendorId);

            if (vendor) {
                return res.status(200).send({
                    status: 200,
                    message: 'success',
                    data: vendor,
                });
            }

            return res.status(404).send({ message: 'Vendor not found.' });
        } catch (error) {
            return next(error);
        }
    }

    static async softDeleteVendorById(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const vendorId = Number(req.params.vendorId);
            const result = await objVendorService.softDeleteVendor(vendorId);

            if (result) {
                return res.status(200).send({ message: 'Vendor soft-deleted successfully.' });
            } else {
                return res.status(404).send({ message: 'Vendor not found.' });
            }
        } catch (error) {
            return next(error);
        }
    }

    static async updateVendor(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const vendorId = Number(req.params.vendorId);
            const vendorData = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const updatedVendor = await objVendorService.updateVendorById(vendorId, vendorData);
            if (updatedVendor) {
                return res.status(200).json(updatedVendor);
            } else {
                return res.status(404).json({ message: "Vendor not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // New method for filtering vendors
    static async filterVendors(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new CCustomErrors(new Error('Validation error'), errorTypeEnum.INPUT_VALIDATION_ERROR, errors.array()));
            }

            // Extract query parameters for filtering
            const vendorName = req.query.vendorName?.toString();
            const vendorEmail = req.query.vendorEmail?.toString();
            const limit = Number(req.query.limit);
            const pageNumber = Number(req.query.pageNumber);

            const filteredVendors = await objVendorService.filterVendors(vendorName, vendorEmail, limit, pageNumber);

            return res.status(200).send({
                status: 200,
                message: 'success',
                data: filteredVendors,
            });
        } catch (error) {
            return next(error);
        }
    }


    //method for patch
    static async patchVendor(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const vendorId = Number(req.params.vendorId);
            const { email, phoneNumber } = req.body; 

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new CCustomErrors(new Error('Validation error'), errorTypeEnum.INPUT_VALIDATION_ERROR, errors.array()));
            }


            const updatedVendor = await objVendorService.patchVendor(vendorId, { email, phoneNumber });
            if (updatedVendor) {
                return res.status(200).json({
                    status: 200,
                    message: 'Vendor email and phone number updated successfully.',
                    data: updatedVendor,
                });
            } else {
                return res.status(404).json({ message: "Vendor not found" });
            }
        } catch (error) {
            return next(error);
        }
    }
}
