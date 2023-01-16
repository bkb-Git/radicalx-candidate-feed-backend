const mongoose = require("mongoose");

const connectDB = async () => {
  // Connect to mongo db database
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((response) =>
      console.log(`Mongo DB Connected : ${response.connection.host}`)
    )
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDB;
