import { Schema, model, Document } from "mongoose";

// Shape of a Delivery document in MongoDB
export interface IDelivery extends Document {
  recipientName: string;
  address: string;
  status: "pending" | "delivered";
  confirmedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const deliverySchema = new Schema<IDelivery>(
  {
    recipientName: {
      type: String,
      required: true,
      minlength: 3,
    },
    address: {
      type: String,
      required: true,
      minlength: 5,
    },
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
      required: true,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
  }
);

export const Delivery = model<IDelivery>("Delivery", deliverySchema);
