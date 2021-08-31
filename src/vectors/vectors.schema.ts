import { Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';


export const VectorSchema = new Schema({
    name: { type: String },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    regions: { type: mongoose.Schema.Types.ObjectId, ref: 'Regions' },
    UID: { type: String },
    classID: { type: Number },
    classTagsName: { type: String },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: [],
    },
}, {
    timestamps: true
});

VectorSchema.index({ location: '2dsphere' });