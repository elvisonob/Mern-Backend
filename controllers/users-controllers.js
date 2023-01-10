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

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const { name, email, password, image, places } = req.body;
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
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Could not save user', 500);
    return next(error);
  }
  res.status(201).json(createdUser);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not find email', 401);
  }

  res.json({ message: 'Welcome mate' });
};

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;
