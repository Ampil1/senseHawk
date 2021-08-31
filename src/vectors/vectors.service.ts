import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVectorDto, UpdateVectorDto } from './vectors.dto';

@Injectable()
export class VectorsService {
    constructor(@InjectModel('Vector')private vectorModel:Model<any>){}

    public async createVector(vectorData: CreateVectorDto): Promise<any> {
        return await this.vectorModel.create(vectorData);
    }

    public async updateVectors(filter: string, updateData: UpdateVectorDto): Promise<any> {
        return await this.vectorModel.findByIdAndUpdate(filter, updateData);
    }
    public async getVectorById(dataFilter: any): Promise<any> {
        return await this.vectorModel.findOne(dataFilter).populate("regions",'regionName');
    }

    public async deleteVector(filter: any): Promise<any> {
        return await this.vectorModel.findOneAndDelete(filter);
    }

    public async getAllVectorList(filter: any): Promise<any> {
        return await this.vectorModel.find(filter).populate("regions",'regionName').sort({ createdAt: 1 });
    }
    public async countAllVectorList(filter: any): Promise<any> {
        return await this.vectorModel.countDocuments(filter);
    }

    public generateUniqueCode() {
        var text = '';
        var possible = 'A1B2C3D4E5F1G4HIJ6KL7MNOPQ4RST4UV8WXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 8; i++) text += possible.charAt(Math.floor(Math.random() * 8));
        return text;
    }

	public async getNearByVector(lngLat?: any,): Promise<Array<any>> {
		let filter = {}
		let data = await this.vectorModel.aggregate([

			{
				$geoNear: {
					near: { type: "Point", coordinates: lngLat },
					spherical: true,
					query: filter,
					distanceField: "calcDistance",
				},
			},
			{ $project: { name: 1, description: 1, owner: 1, regions: 1, UID: 1, classID: 1, classTagsName: 1, location: 1} },
			{ $sort: { "calcDistance": 1 } },
		])
		return data
	}

    
    public async getAllVectorListClassName(filter: any): Promise<any> {
        return await this.vectorModel.find(filter).populate("regions",'regionName').sort({ createdAt: 1 });
    }
}
