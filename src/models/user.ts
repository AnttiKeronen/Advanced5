import mongoose, { Schema, Document } from "mongoose";

/* ----------------------- ITodo INTERFACE ----------------------- */
export interface ITodo {
  todo: string;
  checked: boolean;
}

/* ----------------------- IUser INTERFACE ----------------------- */
export interface IUser extends Document {
  name: string;
  todos: ITodo[];
}

/* -------------------------- TODO SCHEMA ------------------------ */
const TodoSchema = new Schema<ITodo>({
  todo: { type: String, required: true },
  checked: { type: Boolean, default: false }
});

/* -------------------------- USER SCHEMA ------------------------ */
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  todos: { type: [TodoSchema], default: [] }
});

/* -------------------------- MODEL EXPORT ----------------------- */
export const User = mongoose.model<IUser>("User", UserSchema);
