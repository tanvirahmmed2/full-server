const { User } = require("../model/user.model");


const getUser= async(req,res,next)=>{
    const user= await User.find({})
    
    res.status(200).send(user)

}



const registerUser = async(req, res) => {
  const { username, password } = req.body;

  const newUser = { username, password }
  await User.create(newUser)


  res.status(200).send({
    message: "post on user activated",
    payload: { newUser },
  });
};



module.exports = {
  registerUser,
  getUser,
};
