const mongoose = require("mongoose");
module.exports = async function connection() {
  try {
    const connectionParam = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(process.env.MONGODB_URI, connectionParam);
    console.log("connected to database.");
  } catch (error) {
    console.log(error, " Couldnot connect to the database");
  }
};
