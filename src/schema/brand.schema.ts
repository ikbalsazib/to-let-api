import * as mongoose from 'mongoose';

export const BrandSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameBn: {
      type: String,
      required: false,
      trim: false,
    },
    nameIt: {
      type: String,
      required: false,
      trim: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    descriptionBn: {
      type: String,
      required: false,
    },
    descriptionIt: {
      type: String,
      required: false,
    },
    priority: {
      type: Number,
      required: false,
    },
    createdAt: {
      type: Date,
      required: false,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
