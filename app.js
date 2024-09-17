const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/", userRoutes);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://deloaiprivatelimited:deloai@clusterpromptitude.bplkt.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error: ", err); // Log the actual error
    process.exit(1); // Exit the process if connection fails
  });

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
