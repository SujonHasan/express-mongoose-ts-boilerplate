
import mongoose, { Document, Schema } from "mongoose";

interface DocumentType extends Document {

    user: mongoose.Types.ObjectId;
    accessToken: string;
    refreshToken: string;
    revoked?: boolean;
    expires: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const documentSchema = new Schema({

    user: {type: mongoose.Types.ObjectId, required: false, ref: 'user'},
    accessToken: {type: String, required: true, ref: 'o_auth_access_token'},
    refreshToken: {type: String, required: true},
    revoked: {type: Boolean, required: false, default: false},
    expires: {type: Date, required: true},

}, {timestamps: true})


documentSchema.methods.toJSON = function (){

    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
}

const documentModel = mongoose.model<DocumentType>('o_auth_refresh_token', documentSchema)

export {documentModel as OAuthRefreshTokenModel}