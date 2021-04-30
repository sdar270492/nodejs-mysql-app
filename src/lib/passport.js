const passport = require('passport');
const LocalStrategy = require('passport-local');

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    const filas = await pool.query('SELECT * FROM users WHERE username = ?',[username]);

    if (filas.length > 0) {
        const user = filas[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success','Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message','Incorrect password'));
        }
    }else{
        return done(null, false, req.flash('message','the username does not exists'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username: username,
        password: password,
        fullname: fullname
    };
    newUser.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO users SET ?', [newUser]);

    newUser.id = result.insertId;

    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
    const filas = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, filas[0]);
});