# Express Excel Upload API (PostgreSQL)

A simple backend project built using **Node.js, Express, and PostgreSQL** that allows uploading Excel/CSV files, processing their data, and storing valid records in a database.

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Multer (file upload handling)
- xlsx (Excel file parsing)
- pgAdmin 4 (PostgreSQL GUI)

---

# Setup

1.Clone the repository
```
git clone https://github.com/Saksham294/buttermoney_backend.git
```
Switch to folder
```
cd buttermoney_backend
```
2.Install the dependencies
   ```
   npm i
   ```
## Environment variables
```
DB_USER=db_user_name 
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_NAME=your_existing_db
DB_PORT=your_db_port
PORT=your_port
```

Next create database table

Run this once in your existing PostgreSQL database:
```
CREATE TABLE records (
    id SERIAL PRIMARY KEY,
    excel_id INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT CHECK (age > 0),
    education VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Run the App
After installing the dependencies, to run the app
```
node app.js
```

Server will start at
```
http://localhost:3000
```
## 📌 API Endpoints

---

### 1️⃣ Upload File

**POST** `/api/v1/files/upload`

**Rules**
- Allowed formats: `.xls`, `.xlsx`, `.csv`
- Maximum file size: **5MB**
- Files are stored locally in `/uploads`

**Request (form-data)**
- key: file
- value: `file`


**Response**

```json
{
  "filePath": "uploads/1700000000000.xlsx"
}
```
### 2️⃣ Process Excel File

**POST** `/api/v1/process-excel`

**Request Body**
```json
{
  "filePath": "uploads/1700000000000.xlsx"
}
```

**Validation Rules**

- Id must be unique
- Name must not be empty
- Age must be a positive number
- Education must not be null
- Invalid rows are skipped and logged

### 3️⃣ Get All Records

**GET** `/api/v1/getAll`

**Query Parameters**

- page (default: 1)
- limit (default: 10)
- education (optional filter)

Example endpoint

`/api/v1/getAll?page=1&limit=5&education=BTech`

## Testing

- API tested using Postman
- Database verified using pgAdmin 4
- Invalid and duplicate records handled safely
