#  Connect App

A full-stack mobile app built with **React Native**, **Node.js**, **PostgreSQL**, and **Firebase**. Connect App allows users to seamlessly log in, manage their profiles, and explore or create events — all from their phones.

---

## 🛠 Tech Stack

- **Frontend**: React Native (Expo), React Navigation  
- **Backend**: Node.js, Express  
- **Database**: PostgreSQL (hosted on Railway)  
- **Authentication**: Firebase Auth  
- **Cloud Storage**: Firebase Storage  
- **Other Tools**: GitHub Actions (CI/CD), Jest, Railway, Multer

---

##  Features

- 🔐 User authentication with Firebase  
- 🧾 User signup, login, and logout  
- 🖼 Profile management with image upload  
- 📅 Event listing and detailed event view  
- 🔗 Full integration of frontend, backend, and PostgreSQL  
- 💾 Firebase for media and user session handling  
- 🛠 Planned: Notifications, social login, push alerts

---

##  Project Structure

connect-app/

├── client/ # React Native frontend

├── server/ # Express backend

│ ├── routes/ # API routes

│ ├── controllers/ # Request logic

│ └── db/ # PostgreSQL config

└── .github/workflows/ # GitHub Actions (CI/CD)

---

##  Demo Credentials

Use this account to test app features:

Email: demo@connect.com
Password: 123456

---

##  Installation & Setup

###  Backend

1. Clone the repo & navigate:
   ```bash
   git clone https://github.com/kritika0818/connect-app.git
   cd connect-app/server
2. Install dependencies:
   ```bash
   npm install
3. Create .env:
   ```bash
   PORT=5000
   DATABASE_URL=your_postgres_url
   FIREBASE_API_KEY=your_key
4. Start the server:
   ```bash
   node index.js

---

##  Frontend
1. Navigate to client folder:
   ```bash
   cd ../client
2. Install dependencies:
   ```bash
   npm install
3. Start app with expo:
   ```bash
   npx expo start
4.  Scan QR code in Expo Go app on your phone.

---

##  API Endpoints
| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/auth/signup` | Register new user       |
| POST   | `/api/auth/login`  | Login user              |
| PUT    | `/api/users/:id`   | Update user profile     |
| GET    | `/api/users/:id`   | Get profile by ID       |
| GET    | `/api/events`      | Fetch all events        |
| GET    | `/api/events/:id`  | Get event details by ID |

---

##  Testing
- Jest + Supertest setup for backend routes
- React Native Testing Library planned for components
- GitHub Actions CI runs tests automatically on push (see .github/workflows/)

---

##  Screenshots


---

##  Contribution Guidelines
- Fork the repository
- Create your feature branch (git checkout -b feature/YourFeature)
- Commit your changes (git commit -m 'Add something')
- Push your branch (git push origin feature/YourFeature)
- Open a pull request

---

##  Future Improvements
- Push notifications (Expo/Firebase Cloud Messaging)
- Google or social login
- Publish to Play Store
- Invite-based event joining

---

##  Feedback
Found a bug? Have an idea?
Open an issue here
or connect with me on LinkedIn

---

# Star this repo if you like it!
