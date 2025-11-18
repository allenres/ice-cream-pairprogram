import express from 'express';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
app.set('view engine', 'ejs');

// Enable static file serving (client side file that does not communicate with database)
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

const orders = [];

const PORT = 3001;

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/db_test', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

app.get('/admin', async(req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC');
        res.render('admin', {orders});
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

app.post('/submit-form', (req, res) => {
    const order = {
        name: req.body.name,
        email: req.body.email,
        flavor: req.body.flavor,
        cone: req.body.cone,
        toppings: req.body.toppings,
        comments: req.body.comments,
        timestamp: new Date()
    };

    orders.push(order);
    console.log(orders);

    res.render('confirmation', {order});
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})