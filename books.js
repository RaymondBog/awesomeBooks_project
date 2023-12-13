const mongoose = require('mongoose');

const Book = require('./model/bookModel');


    await db.books.insertMany(
        [
            {
                author: 'Lev Nikolayevich Tolstoy',
                title: 'War and Peace',
               
            },
           
            
        ]
    )


insertdata();