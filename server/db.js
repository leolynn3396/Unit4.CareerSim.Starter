const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/ling_unit4_career_sim');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';

app.use(express.json());
app.use(require('morgan')('dev'));

const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS carts_products;

    CREATE TABLE users(
        id UUID DEFAULT gen_random_uuid(),
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE products(
        id UUID DEFAULT gen_random_uuid(),
        name VARCHAR(20),
        price INT,
        category VARCHAR(20),
        description TEXT
    );

    CREATE TABLE carts(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
    );

    CREATE TABLE carts_products(
        id UUID PRIMARY KEY,
        carts_id UUID REFERENCES carts(id) NOT NULL,
        product_id UUID REFERENCES products(id),
        quantity INT NOT NULL,
    );

    `;
    await client.query(SQL);
};

const createUser = async({ username, password })=> {
    const SQL = `
      INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  };

const createProduct = async ({ name }) => {
    const SQL = `
    INSERT INTO products(id, name, price, category, description) VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

const createCart = async ({ user_id, }) => {
  const SQL = `
  INSERT INTO carts(id, user_id ) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
}

const selectOrder = async () => { }

const selectProduct = async () => { }

const fetchCartProducts = async (user_id) => {
    const SQL = `
    SELECT * FROM cart_products where user_id = $1`
        ;
    const response = await client.query(SQL, [user_id]);
    return response.rows;
};

const fetchProductById = async (product_id) => {
    const SQL = `
    SELECT * FROM cart_products where user_id = $1`
        ;
    const response = await client.query(SQL, [product_id])
    return response.rows[0];
};
const fetchCart = async (user_id) => {
    const SQL =`
    SELECT * FROM carts where user_id = $1`;
    const response = await client.query(DQL, [user_id]);
    return response.rows;
};

const createCartProducts = async (cart_id, product_id, quantity) => {
    const SQL =
        `
        INSERT INTO carts_products(id, carts_id, products_id, quantity) VALUES($1, $2, $3, $4) RETURNING *
        `
        const response = await client.query(SQL,[uuid.v4(), cart_id, product_id, quantity])
        return response.rows;
};

const authenticate = async({ username, password })=> {
    const SQL = `
      SELECT id, password 
      FROM users 
      WHERE username = $1
    `;
    const response = await client.query(SQL, [ username ]);
    if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password))=== false){
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    const token = await jwt.sign({ id: response.rows[0].id}, JWT);
    return { token: token };
  };

  const findUserWithToken = async(token)=> {
    let id;
    console.log("insidefinduserwithtoken")
    console.log("passed token " + token)
    try{
      const payload = await jwt.verify(token, JWT);
      id = payload.id;
    }catch(ex){
      const error = Error('not authorized');
      error.status = 401;
      throw error;
  
    }
    const SQL = `
      SELECT id, username FROM users WHERE id=$1;
    `;
    const response = await client.query(SQL, [id]);
    if(!response.rows.length){
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    return response.rows[0];
  };

  const fetchUsers = async()=> {
    const SQL = `
      SELECT id, username FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchProducts = async()=> {
    const SQL = `
      SELECT * FROM products;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    fetchCart,
    createCart,
    fetchProductById,
    fetchCartProducts,
    deleteCart,
    authenticate,
    findUserWithToken,
    createCartProducts,

}