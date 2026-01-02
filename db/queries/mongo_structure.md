# MongoDB Structure for fitapp_users

## Collection: fitapp_users

### Document Structure:

```json
{
  "_id": ObjectId("..."),
  "username": "dave1",
  "password": "$2b$10$hashedPasswordHere",
  "roles": {
    "User": 2001,
    "Editor": 1984,
    "Admin": 5150
  },
  "refreshToken": "jwt_token_or_null",
  "createdAt": ISODate("2024-01-01T00:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00.000Z")
}
```

### Seed Data (Run in MongoDB shell or Compass):

```javascript
use fitness_app_users

db.fitapp_users.insertMany([
  {
    username: "dave1",
    password: "$2b$10$oEbHZlazDHE1YnnJ4XdpGuGh9a/JZOO7Xe6WZtRRsSMgprxMXnKza",
    roles: { User: 2001 },
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: "dave2",
    password: "$2b$10$qj9SWKUSU3p2GW7yDwJ4v..8bNe6hBX6Zx8rGFkVX5jtWFh0a8onO",
    roles: { User: 2001 },
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: "walt1",
    password: "$2b$10$33Q9jtAoaXC4aUX9Bjihxum2BHG.ENB6JyoCvPjnuXpITtUd8x8/y",
    roles: { User: 2001, Editor: 1984, Admin: 5150 },
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: "walt2",
    password: "$2b$10$cvfmz./teMWDccIMChAxZ.HqgL3eoQGYTm1z9lGy5iRf8D7NNargC",
    roles: { User: 2001, Editor: 1984 },
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create unique index on username
db.fitapp_users.createIndex({ username: 1 }, { unique: true });
```
