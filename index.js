import express from "express"
import mongoose from "mongoose"

const app = express()
app.use(express.json())

mongoose
  .connect("mongodb+srv://atulkumarb61_db_user:hTfwqI9sux1k9Nly@cluster0.rjwb19e.mongodb.net/task1")
  .then(() => console.log("MongoDb connected sucessfully"))
  .catch((err) => console.log(err))

// creating Schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// })
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
})

const User = mongoose.model("User", userSchema)

// insert one user
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ message: "User created", data: user })
  } catch (err) {
    res.status(400).json({ message: "Failed to create user", error: err.message })
  }
})

// insert multiple users
app.post("/users/bulk", async (req, res) => {
  try {
    const users = req.body
    const insertedUsers = await User.insertMany(users)
    res.status(201).json({ message: "Users created", data: insertedUsers })
  } catch (err) {
    res.status(400).json({ message: "Failed to create users", error: err.message })
  }
})

// get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: "Failed to get users", error: err.message })
  }
})

// get user by id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (err) {
    res.status(400).json({ message: "Invalid user id", error: err.message })
  }
})

// update user by id
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ message: "User updated", data: updatedUser })
  } catch (err) {
    res.status(400).json({ message: "Failed to update user", error: err.message })
  }
})

// delete user by id
app.delete("/users/:id", async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id)
  if (!deletedUser) return res.status(404).json({ message: "User not found" })
  res.json({ message: "User deleted" })
})

app.listen(6000, () => {
  console.log("server is running on 6000")
})