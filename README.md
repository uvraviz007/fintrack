
# FinTrack

FinTrack is an expense tracking web application that helps users manage and split shared expenses with friends, roommates, or colleagues. It is inspired by Splitwise and provides an easy way to create groups, add expenses, split bills, and track balances.

## Features

- User registration and authentication
- Create and manage groups
- Add expenses with descriptions and amounts
- Split expenses among group members
- Track who owes what in real-time
- Settle payments and clear balances
- Responsive and user-friendly interface

## Technologies Used

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT-based authentication

**Frontend:**
- React.js
- Redux for state management
- Axios for API requests
- Material UI or Bootstrap for styling

## Installation

### Prerequisites
- Node.js installed on your machine
- MongoDB database (local or cloud)

### Steps to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fintrack.git
   cd fintrack
   ```

2. Install dependencies:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the `backend` folder with the following content:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Run the backend server:
   ```bash
   cd backend
   npm start
   ```

5. Run the frontend:
   ```bash
   cd ../frontend
   npm start
   ```

6. Open `http://localhost:3000` in your browser.

## API Endpoints

- `POST /api/auth/signup` – Register a new user
- `POST /api/auth/login` – User login
- `GET /api/groups` – Get all groups for the user
- `POST /api/groups` – Create a new group
- `GET /api/groups/:id` – Get group details
- `POST /api/expenses` – Add a new expense
- `GET /api/expenses/:groupId` – Get expenses for a group

## Folder Structure

```
fintrack/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
├── README.md
└── package.json
```

## Future Improvements

- Add expense categorization
- Real-time notifications and chat
- Dark mode support
- Recurring expenses
- Reports and analytics dashboard

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for improvements or bug fixes.

1. Fork it
2. Create a branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to your branch: `git push origin feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License.

## Contact

**Ravi Sharma**  
📧 ravi.sharma172126@gmail.com  
🌐 [LinkedIn](https://www.linkedin.com/in/ravi-sharma-6b5b42235/) | [GitHub](https://github.com/uvraviz007)
