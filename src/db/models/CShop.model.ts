import { CShopEntities } from "../entities/CShop.entities";
import AppDataSource from "../dataSource";
import { SignUpReq, SignUpResp, getAllShops, getShopDetailsByNameZipCodeResp, getShopDetailsByShopEmailIdResp, getShopDetailsByShopMobileNumberResp } from "../../interfaces/CShop.interface";

export class CShopModel {
   
    protected repository;
    constructor() {
        this.repository = AppDataSource.getRepository( CShopEntities );
    }

    public async signUp( objNewShop : SignUpReq): Promise<SignUpResp> {
        try{
            console.log('Jumped in CShopModel => signUp()');

            const {shopId, shopName, shopOwnerName, shopCity, shopCityZipCode, shopMobileNumber, shopEmailId} = await this.repository.save( objNewShop );

            return {shopId, shopName, shopOwnerName, shopCity, shopCityZipCode, shopMobileNumber, shopEmailId};
        } catch( error ) {
            throw new Error( error );
        }
    }

    public async getShopDetailsByNameZipCode(shopName: string, shopCityZipCode: string): Promise<getShopDetailsByNameZipCodeResp> {
        try{
            console.log('Jumped in CShopModel => getShopDetailsByNameZipCode()');

            return await this.repository.findOne({
                select: {
                    shopId: true,
                    shopName: true,
                    shopOwnerName: true
                },
                where: {
                    shopName: shopName,
                    shopCityZipCode: shopCityZipCode
                }
            });

        } catch(error) {
            throw new Error( error );
        }
    }

    public async getShopDetailsByShopMobileNumber(shopMobileNumber: string): Promise<getShopDetailsByShopMobileNumberResp> {
        try{
            console.log('Jumped in CShopModel => getShopDetailsByShopMobileNumber()');

            return await this.repository.findOne({
                select: {
                    shopId: true,
                    shopName: true,
                    shopOwnerName: true,
                    shopMobileNumber: true
                },
                where: {
                    shopMobileNumber: shopMobileNumber,
                }
            });

        } catch(error) {
            throw new Error( error );
        }
    }

    public async getShopDetailsByShopEmailId(shopEmailId: string): Promise<getShopDetailsByShopEmailIdResp> {
        try{
            console.log('Jumped in CShopModel => getShopDetailsByShopEmailId()');

            return await this.repository.findOne({
                select: {
                    shopId: true,
                    shopName: true,
                    shopOwnerName: true,
                    shopEmailId: true
                },
                where: {
                    shopEmailId: shopEmailId,
                }
            });

        } catch(error) {
            throw new Error( error );
        }
    }

    public async getAllShops(limit: number = 10, pageNumber: number = 1): Promise<getAllShops[]> {
        try{
            console.log('Jumped in CShopModel => getAllShops()');
            const skip = (limit * pageNumber) - limit;

            return await this.repository
            .createQueryBuilder('shop')
            .leftJoinAndSelect('shop.shopTypeStatic', 'shopType')
            .select(['shop.shopId', 'shop.shopName', 'shop.shopOwnerName', 'shop.shopMobileNumber', 'shop.shopEmailId', 'shop.shopGSTNumber', 'shop.shopCityZipCode', 'shopType.shopTypeShortDescription'])
            .skip(skip)
            .take(limit)
            .getMany();


        } catch(error) {
            throw new Error( error );
        }
    }

    // updateShopDetails(shopId: string, shopData: Partial<SignUpReq>) {
    //     throw new Error("Method not implemented.");
    // }
    // softDeleteShopById(shopId: string) {
    //     throw new Error("Method not implemented.");
    // }
    // getShopDetailsById(shopId: string) {
    //     throw new Error("Method not implemented.");
    // }



}