const HttpError = require('./../models/http-error');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const Place = require('./../models/places');
const { findById } = require('./../models/places');

let DUMMY_PLACES = [
  {
    id: 'p1',
    name: 'AlexanderPlatz',
    description: 'A popular place in Berlin',
    address: 'Berlin city center',
    creator: 'u1',
  },
  {
    id: 'p2',
    name: 'Union Square',
    description: 'A popular place in Aberdeen',
    address: 'Aberdeen-city-center',
    creator: 'u2',
  },
];

const getPlaceById = async (req, res, next) => {
  const { pid } = req.params;

  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not get a place at all', 404);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const getUserById = async (req, res, next) => {
  const { uid } = req.params;

  let user;

  try {
    user = await Place.find({ creator: uid });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find user',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find the request', 404);
    return next(error);
  }

  res
    .status(200)
    .json({ user: user.map((user) => user.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const { title, description, address, image, creator } = req.body;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new HttpError('Could not validate user input', 422);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    image,
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed,', 422);
  }
  const { pid } = req.params;
  const { title, description } = req.body;

  let newUpdate;
  try {
    newUpdate = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not edit place',
      500
    );
    return next(error);
  }

  newUpdate.title = title;
  newUpdate.description = description;

  try {
    await newUpdate.save();
  } catch (err) {
    const error = new HttpError('Could not save file', 500);
    return next(error);
  }

  res.status(201).json({ newUpdate: newUpdate.toObject({ getters: true }) });
};
const deletePlace = async (req, res, next) => {
  const { pid } = req.params;
  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError('Could not find place', 500);
    return next(error);
  }

  try {
    place.remove();
  } catch (err) {
    const error = new HttpError('Could not delete place', 500);
    return next(error);
  }
  res.status(200).json({ message: 'place successfully deleted' });
};

exports.getPlaceById = getPlaceById;
exports.getUserById = getUserById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
