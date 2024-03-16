import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 10000;
app.use(bodyParser.json())
app.use(cors())

const users = new Map();
const salt = 'salty';
const hashPassword = (password) => crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
const Authorization = `Bearer ${process.env.TOKEN}`;
app.post('/signup', (req, res) => {
    const { user, password } = req.body;
    if (!users.has(user)) {
        users.set(user, hashPassword(password));
        res.sendStatus(200);
    } else
        res.sendStatus(401);
});

app.post('/login', (req, res) => {
    const { user, password } = req.body;
    res.sendStatus(users.get(user) === hashPassword(password) ? 200 : 401);
});

app.post('/clashPlayerInfo', async (req, res) => {
    const { user } = req.body;
    const x = await fetch(`https://api.clashofclans.com/v1/players/${user?.replaceAll('#', '%23')}`, {
        headers: {
            Authorization,
        },
    }).then((res) => res.json());
    console.log(x);
    res.send(x);
});

app.post('/verifyPlayerToken', async (req, res) => {
    const { user, token } = req.body;
    const x = await fetch(`https://api.clashofclans.com/v1/players/${user.replaceAll('#', '%23')}/verifytoken`, {
        headers: {
            Authorization,
        },
        method: 'POST',
        body: JSON.stringify({
            token,
        }),
    }).then((res) => res.json());
    console.log(x);
    res.send(x);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
