const userControll = require("../models/user");
const contentData = require("../models/content");
const bcrypt = require("bcrypt");


const content = (req, res, next) => {
  const content = new contentData({
    userId: req.body.userId,
    discription: req.body.discription,
    title: req.body.title,
    profile: req.file.path,
  });
  content
    .save()
    .then((result) => console.log(result))
    .catch((err) => console.log(err));

  res.json({
    message: "file uploaded",
    createcContent: content,
    profile_url: `localhost:5000/profile/${req.file.path}`,
  });
};

const userSignup = (req, res) => {
  userControll
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists",
        });
      } else {
        console.log(req.body.password);
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(400).json({
              error: err,
            });
          } else {
            const user = new userControll({
              name: req.body.name,
              email: req.body.email,
              password: hash,
              role: req.body.role,
            });
            console.log(user);
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  result,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

const userpost = async (req, res) => {
  const userdata = userControll({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await userdata
    .save()
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(400).send({
        error: err,
      });
    });
};

const userLogin = (req, res) => {
  userControll
    .find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(400).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          res.status(400).json({
            message: "wrong password",
          });
        } else {
          res.status(200).send({
            result: result,
            user: user,
            isAdmin: user[0].role == "admin" ? true : false,
          });
        }
      });
    });
};

const getAllUserContent = (req, res) => {
  contentData
    .find()
    .populate("userId")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(400).send({
        message: "not found",
        error: error,
      });
    });
};

const getAllContent = (req, res) => {
  contentData
    .find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(400).send({
        message: "not found",
        error: error,
      });
    });
};
const getAllUser = (req, res) => {
  userControll
    .find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      res.status(400).send({
        message: "not found",
        error: error,
      });
    });
};

const like = (req,res) => {
  contentData.findByIdAndUpdate({_id:req.params._id},{"$set":{likes:req.body.likes}},{"new":true})

  // const likes = new contentData({
  //   likes:req.body.likes
  // })
  // likes.save()
   .then(result => {
    res.status(200).send(result)
  }).catch(error => {
    res.status(400).send({
      error:error
    })
  })
}

const unlike = (req,res) => {
  contentData.findOneAndRemove({likes:req.body.likes})

  // const likes = new contentData({
  //   likes:req.body.likes
  // })
  // likes.save()
   .then(result => {
    res.status(200).send(result)
  }).catch(error => {
    res.status(400).send({
      error:error
    })
  })
}



module.exports = {
  userSignup,
  userLogin,
  userpost,
  content,
  getAllUserContent,
  getAllContent,
  getAllUser,
  like,
  unlike
};
