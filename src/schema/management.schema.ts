import * as mongoose from 'mongoose';

export const ManagementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    mobileImage: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    managementType: {
      type: String,
      required: false,
    },
    priority: {
      type: Number,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
