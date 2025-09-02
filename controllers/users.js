const AppError = require("../utilts/AppError");
const User = require("../models/user");
const Post = require("../models/post");

//curd
//create user//post
//get all users//get
//update user//put
//delete user//delete
//patch user//patch
//get user by id//get



const createUser = async (req, res) => {

  console.log(req.body)
  const body = req.body;
  const imageUrl = Array.isArray(req.images)&& req.images.length>0?req.images[0]:null
  const user = await User.create({
    name: body.name,
    email: body.email,
    age: body.age,
    image: imageUrl,
    bio: body.bio,
    password: body.password,
  });

  res.status(200).json({ message: "user created", user });
};

const getAllUsers = async (req, res) => {
  const {limit,page,name}=req.query
  let query={}
  if(name){
    query.name=name
  }
  const skip = (page-1)*limit
  const users = await User.find(query).limit(limit).skip(skip);
  const total = await User.countDocuments(query)
  const pag={
    total,
    page,
    pages: Math.ceil(total/limit)
  }
  res.status(200).json({users ,pag});
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  // const user2 =await User.findOne({id:id})
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json(user);
};
const updateUserPutMethod = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const user = await User.findByIdAndUpdate(id, body, { new: true });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ message: "user updated", user });
};
const updateUserPatchMethod = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const user = await User.findByIdAndUpdate(id, body, { new: true });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ message: "user updated", user });
};
const deleteUser = async (req, res) => {
  const id = req.params.id

 const user= await User.findByIdAndDelete(id)
 
 if (!user) {
   throw new AppError("User not found", 404);
  }
  await Post.deleteMany({autherId:user.id})
  
  res.status(200).json({ message: "user deleted" });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserPutMethod,
  updateUserPatchMethod,
  deleteUser,
};
