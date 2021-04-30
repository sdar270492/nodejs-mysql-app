const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    

    const { title, url, description } = req.body;
    const newLink = { title: title, url: url, description: description, user_id: req.user.id};

    await pool.query('INSERT INTO links set ?', [newLink]);
    
    req.flash('success', 'Link saved successfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);

    res.render('links/list', { links: links} );
})

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    // console.log(req.params.id);
    // res.send('Eliminado');
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link removed successfully');

    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE ID = ? ', [id]);
    // console.log(links);
    res.render('links/edit', { link: links[0] } )
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    const newLink = { title: title, url: url, description: description};

    await pool.query('UPDATE links SET ? WHERE ID = ? ', [newLink, id]);
    req.flash('success', 'Link updated successfully');

    // console.log(links);
    res.redirect('/links');
});



module.exports = router;