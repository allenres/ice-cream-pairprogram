import express from 'express';

const app = express();
app.set('view engine', 'ejs');

// Enable static file serving (client side file that does not communicate with database)
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const PORT = 3001;

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/submit-form', (req, res) => {
    const orders = [];

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
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})