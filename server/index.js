const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_notes_db')
const app = express();
app.use(express.json());

//deployement only
const path = require("path");
app.get("/", (req, res) => {
    res.send("hello world")
})
app.listen(3000)


app.get("api/auth/me", async (req, res, next)=>{
    try{

    }catch(error){
    next(error);
}});
app.use(express.json());
app.use(require('morgan')('dev'));

//isLoggedIn from block36
const isLoggedIn = async(req, res, next)=> {
    try {
      req.user = await findUserWithToken(req.headers.authorization);
      next();
    }
    catch(ex){
      next(ex);
    }
  };


// //app routes// 
app.get('/api/users', async (req, res, next) => {
    try {
        res.send("users")
    } catch (error) {
        next(error);
    }
});
app.get('/api/products', async (req, res, next) => {
    try {
        res.send("products")
    } catch (error) {
        next(ex);
    }
});
app.listen(3000)

// //POST
app.post('/api/users', async (req, res) => { });
app.post('/api/products', async (req, res) => { });

app.post('/api/login', async (req, res) => {
  
    try {
        const {username, password} = req.body;
        const SQL = `SELECT * FROM users WHERE username = $1`;
        const userResponse = await client.query(SQL, [username]);
        console.log(userResponse.rows[0]);

        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password,user.password))) {
            return res.status(401).json({message: "Invalid username or password"});
        }
        const token = JsonWebTokenError.sign({user}, "secret");
        res.json({message: "Login successful", token});

    }catch(error) {
        res.status(500).json({message: "Internal server error"});
    }
})
//PUT
app.put('/api/users', async (req, res) => { });

app.put('/api/products', async (req, res) => { });
//DELETE
app.delete('/api/users', async (req, res) => { });
app.delete('/api/products', async (req, res) => { });



// ///============///

app.get('/api/users/cart_products', async (req, res, next) => {
    try {
        res.send(response.rows)

    } catch (error) {
        next(error)
    }

});


// //=========================================//

// app.post('/api/notes', async (req, res, next) => { });
// app.get('/api/notes', async (req, res, next) => {
//     try {
//         const SQL = `SELECT * from notes ORDER BY created_at DESC;`
//         const response = await client.query(SQL)
//         res.send(response.rows)

//     } catch (error) {
//         next(error)
//     }
// });
// app.put('/api/notes/:id', async (req, res, next) => { });
// app.delete('/api/notes/:id', async (req, res, next) => { });

// //Create an async function
const init = async () => {
    //Inside the code body of the function, first awat client.connect()
    await client.connect();
    console.log('connected to database');
    let SQL = `
    DROP TABLE IF EXISTS categories;
    CREATE TABLE categories(
        id SERIAL PRIMARY KEY,
        name VARchAr(255) NOT NULL);
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    ranking INTEGER DEFAULT 3 NOT NULL,
    txt VARCHAR(255) NOT NULL
    );`;
    await client.query(SQL);
    console.log('tables created');
    SQL = `INSERT INTO notes(txt, ranking) VALUES('learn express', 5);
    INSERT INTO notes(txt, ranking) VALUES('write SQL queries', 4);
    INSERT INTO notes(txt, ranking) VALUES('create routes', 2);`;
    await client.query(SQL);
    console.log('data seeded');

    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`listening on port ${port}`))
};

init();