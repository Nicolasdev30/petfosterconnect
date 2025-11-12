
DROP TABLE IF EXISTS request;
DROP TABLE IF EXISTS animal;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS association;
DROP TABLE IF EXISTS role;


-- 🎭 Table : role
CREATE TABLE role (
  id_role INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  label VARCHAR(50) NOT NULL UNIQUE
);

-- 🏢 Table : association
CREATE TABLE association (
  id_association INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT NOT NULL
);

-- 👤 Table : user
CREATE TABLE "user" (
  id_user INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  id_role INTEGER NOT NULL REFERENCES role(id_role) ON DELETE RESTRICT,
  id_association INTEGER REFERENCES association(id_association) ON DELETE SET NULL
);

-- 🐾 Table : animal
CREATE TABLE animal (
  id_animal INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(50),
  breed VARCHAR(100),
  age INTEGER CHECK (age >= 0),
  description TEXT,
  photo_url TEXT,
  status VARCHAR(20) CHECK (status IN ('disponible', 'accueilli')) DEFAULT 'disponible',
  id_association INTEGER NOT NULL REFERENCES association(id_association) ON DELETE RESTRICT
);

-- ✉️ Table : request
CREATE TABLE request (
  id_request INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'refused')) DEFAULT 'pending',
  message TEXT,
  id_user INTEGER NOT NULL REFERENCES "user"(id_user) ON DELETE RESTRICT,
  id_animal INTEGER NOT NULL REFERENCES animal(id_animal) ON DELETE RESTRICT
);
