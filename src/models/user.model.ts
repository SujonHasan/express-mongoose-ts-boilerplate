import bcrypt, { genSalt } from 'bcrypt'
import mongoose, { Document, Schema } from "mongoose";

export interface DocumentType extends Document {
  role: {
    _id?: mongoose.Types.ObjectId;
    name?: string | null;
  };
  email: string;
  username: string;
  password: string;
  personal: {
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    gender?: keyof typeof documentGender;
    photo?: string | null;
  };
  superAdmin: boolean;
  status?: keyof typeof documentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const documentStatus = Object.freeze({
  active: "active",
  inactive: "inactive",
  deleted: "deleted",
});

const documentGender = Object.freeze({ male: "male", female: "female" });

const roleSchema = new Schema({
  _id: { type: mongoose.Types.ObjectId, required: false, ref: "role" },
  name: {type: String, required: false, default: null}
}, {_id: false});

const personalSchema = new Schema({
  firstName: {type: String, required: false, default: null},
  lastName: {type: String, required: false, default: null},
  phone: {type: String, required: false, default: null},
  gender: {type: String, enum: Object.values(documentGender), required: false, default: documentGender.male},
  photo: {type: String, required: false, default: null}
}, {_id: false});

const documentSchema = new Schema({
    role: {
        type: roleSchema, required: false, default: ()=> ({})
    },
    email: {type: String, required: true, unique: true, trim: true, lowercase: true, validate: { validator: (value: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value), message: "Invalid email format", } },
    username: {type: String, required: true, trim: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    personal: {type: personalSchema, required: false, default: ()=> ({})},
    superAdmin: {type: Boolean, required: true},
    status: {type: String, required: false, enum: Object.values(documentStatus), default: documentStatus.active}
}, {timestamps: true})

documentSchema.pre("save", async function (next: any) {

  let user = this as DocumentType;

  if(!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hashSync(user.password, salt);

  return next();
});

documentSchema.statics.isUnique = async function(username: string, email: string) {

  const user = await this.findOne({
    $or: [{email}, {username}]
  });

  if(!user) return true;
  else if(user.username === username && user.email === email) return {username, email}
  else if(user.email === email) return {email}
  else if(user.username === username) return {username}

  return true;

}

documentSchema.methods.comparePassword = async function (candidatePassword: string){
  const user = this as DocumentType;
  return bcrypt.compare(candidatePassword, user.password).catch(()=> false)
}

documentSchema.methods.toJSON = function () {

  let obj = this.toObject();

  delete obj.password;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;

  return obj;
}

const documentModel = mongoose.model<DocumentType>('user', documentSchema);

export {documentModel as UserModel, documentStatus as UserStatus, documentGender as UserGender}