import mongoose, { Schema, Document } from "mongoose";

export interface ITodo {
  todo: string;
  checked: boolean;
}

export interface IUser extends Document {
  name: string;
  todos: ITodo[];
}

const TodoSchema = new Schema<ITodo>({
  todo: { type: String, required: true },
  checked: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  todos: { type: [TodoSchema], default: [] }
});

export const User = mongoose.model<IUser>("User", UserSchema);
