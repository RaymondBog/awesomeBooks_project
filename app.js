const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const Book = require('./model/bookModel');
const ejs = require('ejs');
const path = require('path');
const User = require('./model/userModel');
const bcrypt = require('bcrypt');
port = process.env.PORT || 5050



const app = express();
app.use(session({
  secret: 'your-secret-key', // Change this to a secure secret key
  resave: false,
  saveUninitialized: true,
}));
mongoose.connect('mongodb://127.0.0.1:27017/AwesomeBooks');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));




const checkSignIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
};


app.get('/', checkSignIn, async (req, res,next) => {
  res.render('bookform');
});


app.get('/books', async (req, res,) => {
  try {
    const books = await Book.find();
    res.render('index', { books }); 
  } catch (err) {
    return res.status(500).send(err);
  }
});

  app.get('/book/:id',checkSignIn, async (req, res, next) => {
    try {
        let id = req.params.id;
        const book = await Book.findById({'_id': id});
        res.render('bookId', {book} )
    } catch (err) {
        res.status(500).send(err);
    }
});

  
  
  app.post('/save', (req, res) => {
    Book.create(req.body)
    .then((result) => {
        res.redirect('/books')
    })
    .catch((err) => {
    })
  });

  app.get('/signup', async (req, res) => {
    res.render('signup')
  });

  app.post("/signup", async (req, res) => {
    try {
      const { name, email, username, password, password_confirm } = req.body;
      console.log("Received form data:", req.body);
  
      let user = await User.findOne({ 'email': email });
      if (!user) {
        if (password !== password_confirm) {
          
          return res.render('signup', { error: 'Passwords do not match' });
        }
  
        let hashedPassword = await bcrypt.hash(password, 8);
        await User.create({ name, email, username, password: hashedPassword });
  
        console.log("User created successfully");
  
        res.redirect('/login');
      }
    } catch (error) {
      console.error(error)
      res.status(500).send("Internal Server Error");
    }
  });
  

  app.get('/login', async (req, res) => {
    res.render('login');
  });

  app.post('/login', async (req, res,) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
          return res.render('login', { error: 'Kindly provide your email and password' });
        }

        const user = await User.findOne({ 'username': username });

        if (!user) {
          return res.render('login', { error: 'Invalid Username or Password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          console.log("Login successful. Redirecting...");
          req.session.user = user
          console.log(req.session.user)
            return res.redirect('/');
        } else {
          console.log("Invalid username or password");
          return res.render('login', { error: 'Invalid Username or Password' });

        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.get('/about', async (req, res) => {
  res.render('about');
});

app.get('/contact', async (req, res) => {
  res.render('contact');
});



app.listen(port, () =>{
    console.log('app listening at port ' + port);
});