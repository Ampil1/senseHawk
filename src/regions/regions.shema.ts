import { Schema, Types } from 'mongoose';
import * as mongoose from 'mongoose';
export const RegionsSchema = new Schema({
    regionName: { type: String },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    UID: { type: String },
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