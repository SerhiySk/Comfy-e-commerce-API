const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      required: [true, 'Please provide title'],
      maxLength: [100, 'description cannot be longer than 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide text'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
// reviewSchema.post('save', async function () {
//   const product = await this.model('Product').findOne({ _id: this.product });

//   console.log(this.product);
//   // const ratingSum = await reviewSchema.aggregate([
//   //   { $match: { product: this.product } },
//   //   { $group: { rating: { $sum: '$rating' } } },
//   // ]);
//   // console.log(ratingSum);
// });
reviewSchema.statics.calcRatingEvarage = async function (productId) {
  const ratingSum = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: null,
        ratingEvarage: {
          $avg: '$rating',
        },
        numOfReviews: {
          $sum: 1,
        },
      },
    },
  ]);
  console.log(productId);

  const product = await this.model('Product').findOne({ _id: productId });
  await this.model('Product').findOneAndUpdate(
    { _id: productId },
    {
      averageRating: Math.ceil(ratingSum[0]?.ratingEvarage || 0),
      numOfReviews: ratingSum[0]?.numOfReviews || 0,
    }
  );
  console.log(product);
};

reviewSchema.post('save', async function () {
  await this.constructor.calcRatingEvarage(this.product);
});
reviewSchema.post('remove', async function () {
  await this.constructor.calcRatingEvarage(this.product);
});
module.exports = mongoose.model('Review', reviewSchema);
