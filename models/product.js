const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxLength: [100, 'name cannot be longer than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxLength: [1000, 'description cannot be longer than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please provide product company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    featured: {
      type: String,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,

      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});
productSchema.pre('remove', async function () {
  await this.model('Review').deleteMany({ product: this._id });
});

module.exports = mongoose.model('Product', productSchema);
