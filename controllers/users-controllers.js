const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Elvis Ono',
    email: 'test@test.com',
    password: 'testers',
  },
];

const getUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('No users found', 500);
    return next(error);
  }
  res.status(200).json({
    allUsers: allUsers.map((user) => user.toObject({ getters: true })),
  });
};

const signup = async (req, res, next) => {
  const { name, email, password, image } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Could not ascertain process yet', 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError('User already exist, use a new name', 422);
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    password,
    image,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Could not save user', 500);
    return next(error);
  }
  res.status(201).json(createdUser);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('User Information is not available', 500);
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('User credentials is not correct', 401);
    return next(error);
  }
  res.status(200).json({ message: 'logged in' });
};

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;
