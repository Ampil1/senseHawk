import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRegionDto, UpdateRegionDto } from './regions.dto';

@Injectable()
export class RegionsService {
    constructor(@InjectModel('Regions') private regionModel: Model<any>) { }

    public async createRegions(RegionsData: CreateRegionDto): Promise<any> {
        return await this.regionModel.create(RegionsData);
    }

    public async updateRegions(regionfilter: string, RegionsData: UpdateRegionDto): Promise<any> {
        return await this.regionModel.findByIdAndUpdate(regionfilter, RegionsData);
    }
    public async getRegionsById(dataFilter: any): Promise<any> {
        return await this.regionModel.findOne(dataFilter);
    }

    public async deleteRedions(regionfilter: any): Promise<any> {
        return await this.regionModel.findOneAndDelete(regionfilter);
    }

    public async getAllRegionsList(regionfilter: any): Promise<any> {
        return await this.regionModel.find(regionfilter).sort({ createdAt: 1 });
    }
    public async countAllRegionsList(regionfilter: any): Promise<any> {
        return await this.regionModel.countDocuments(regionfilter);
    }

    public generateUniqueCode() {
        var text = '';
        var possible = 'A1B2C3D4E5F1G4HIJ6KL7MNOPQ4RST4UV8WXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 8; i++) text += possible.charAt(Math.floor(Math.random() * 8));
        return text;
    }
}
