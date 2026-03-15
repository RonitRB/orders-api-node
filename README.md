# Order Management API

A backend REST API built using **Node.js, Express, and MongoDB** for managing orders.  
This project demonstrates a modular backend architecture with controllers, models, and routes while integrating MongoDB for persistent storage.

---

# Features

- Create Order
- View Orders
- Update Order
- Delete Order
- MongoDB database integration
- RESTful API architecture
- Modular backend structure
- Error handling middleware

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs

---

# API Testing

You can test the API using the included Postman collection.

Import the file:

**db/postman-collection.json**

into Postman to quickly test all endpoints.

---

# Running the Project Locally

1. Clone the repository

```bash
git clone https://github.com/RonitRB/orders-api-node.git
```

```bash
cd orders-api-node
```

2. Install dependencies

```bash
npm install
```

3. Start MongoDB

If using Docker:

```bash
docker run -d -p 27017:27017 mongo
```

4. Start the server

```bash
node index.js
```

Server will start at:
http://localhost:3000

---

Author: Ronit Bongale
GitHub: https://github.com/RonitRB⁠

---

### After updating the README

Run these commands in **Git Bash**:

```bash
git add README.md
git commit -m "Improve README with API documentation and sample request"
git push
