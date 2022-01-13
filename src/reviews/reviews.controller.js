const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const reviewId = req.params.reviewId;
  const foundReview = await service.read(reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  next({
    status: 404,
    message: `Review cannot be found`,
  });
}

async function update(req, res) {
  const { reviewId } = req.params;
  await service.update(reviewId, req.body.data);
  res.json({ data: await service.showUpdatedReview(reviewId) });
}

async function destroy(req, res, next) {
  const review = res.locals.review;
  await service.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
