const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_auth_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

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
        id UUID PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );

    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(20),
        quantity INT DEFAULT 10
    );

    CREATE TABLE carts(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_user_id UNIQUE (user_id)
    );

    CREATE TABLE carts_products(
        id UUID PRIMARY KEY,
        carts_id UUID REFERENCES carts(id) NOT NULL,
        product_id UUID REFERENCES product(id),
        quantity INT NOT NULL,
    );

    `;
    await client.query(SQL);
};

const createUser = async({username, password}) => {
    const SQL = `
    INSERT INTO users(id, username, password)`;
    const response = await client.query(SQL);
};

const createProduct = async ({ name }) => {
    const SQL = `
    INSERT INTO products(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

const createCart = async ({ user_id, }) => {


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
}


module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts,
    fetchCart,
    createCart,
    deleteCart,
    authenticate,
    findUserWithToken,
    createCartProducts,

}