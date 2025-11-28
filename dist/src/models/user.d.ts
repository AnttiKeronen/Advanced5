import mongoose, { Document } from "mongoose";
export interface ITodo {
    todo: string;
    checked: boolean;
}
export interface IUser extends Document {
    name: string;
    todos: ITodo[];
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=user.d.ts.map