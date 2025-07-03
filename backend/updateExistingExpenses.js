const mongoose = require('mongoose');
const Expense = require('./models/expense.model');
require('dotenv').config();

// Define the MongoDB connection URL with fallback
const mongoURL = "mongodb+srv://uvraviz26:9026678700@cluster0.zpzfftb.mongodb.net/";

const updateExistingExpenses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB server successfully');

    // Find all expenses that don't have a category field or have null/undefined category
    const expensesWithoutCategory = await Expense.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: undefined },
        { category: "" }
      ]
    });

    console.log(`Found ${expensesWithoutCategory.length} expenses without category`);

    if (expensesWithoutCategory.length > 0) {
      // Update all these expenses to have 'Others' as category
      const updateResult = await Expense.updateMany(
        {
          $or: [
            { category: { $exists: false } },
            { category: null },
            { category: undefined },
            { category: "" }
          ]
        },
        { $set: { category: 'Others' } }
      );

      console.log(`Updated ${updateResult.modifiedCount} expenses with default category 'Others'`);
    } else {
      console.log('All expenses already have categories');
    }

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('Error updating expenses:', error);
    process.exit(1);
  }
};

// Run the update
updateExistingExpenses(); 