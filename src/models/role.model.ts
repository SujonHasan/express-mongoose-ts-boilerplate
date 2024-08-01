import mongoose, { Document, Schema } from "mongoose";


const documentStatus = Object.freeze({
    active: "active",
    inactive: "inactive",
    deleted: "deleted",
});

interface DocumentType extends Document {
    name: string;
    description?: string | null;
    permissions: string[];
    status?: keyof typeof documentStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

const documentSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false, default: null},
    permissions: [{type: String, required: false, default: []}],
    status: {type: String, enum: Object.values(documentStatus), required: false, default: documentStatus.active},

}, {timestamps: true});

documentSchema.methods.toJSON = function (){
    let obj = this.toObject();

    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;

    return obj;
}

const documentModel = mongoose.model<DocumentType>('role', documentSchema);

export {documentModel as RoleModel, documentStatus as UmRoleStatus};