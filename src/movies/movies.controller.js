const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movieId = req.params.movieId;
  const foundMovie = await service.read(movieId);
  if (foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  }
  next({
    status: 404,
    message: `Movie cannot be found`,
  });
}

async function list(req, res) {
  const isShowing = req.query.is_showing;

  if (isShowing) {
    const onlyShowing = await service.listOnlyShowingMovies();
    res.json({ data: onlyShowing });
  } else {
    const list = await service.list();
    res.json({ data: list });
  }
}

async function read(req, res) {
  const id = req.params.movieId;
  const movies = await service.read(id);
  res.json({ data: movies });
}

async function showTheaters(req, res) {
  const movieId = req.params.movieId;
  const theaters = await service.showTheaters(movieId);
  res.json({ data: theaters });
}

async function showReviews(req, res) {
  const movieId = req.params.movieId;
  const reviews = await service.showReviews(movieId);
  res.json({ data: reviews });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  showTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(showTheaters),
  ],
  showReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(showReviews),
  ],
};
