const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritics = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

function list() {
  return knex("movies").select("*");
}

function listOnlyShowingMovies() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

function read(id) {
  return knex("movies")
    .select("*")
    .where({ movie_id: id })
    .groupBy("movie_id")
    .first();
}

function showTheaters(id) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ movie_id: id, is_showing: true });
}

function showReviews(id) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ "m.movie_id": id })
    .then((reviews) => reviews.map(addCritics));
}

module.exports = {
  list,
  listOnlyShowingMovies,
  read,
  showTheaters,
  showReviews,
};
