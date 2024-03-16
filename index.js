import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 4000;
app.use(bodyParser.json())
app.use(cors())

const users = new Map();
const salt = 'salty';
const hashPassword = (password) => crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

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
    const x = await fetch(`https://api.clashofclans.com/v1/players/${user.replaceAll('#', '%23')}`, {
        headers: {
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjZiNzczODJiLTAwNzYtZTgyMy02NzE2LWMwOGRhZjk1MWUwOCIsImlhdCI6MTcxMDYxNDcxNywiZXhwIjoxNzEwNjE4MzE3LCJzdWIiOiJkZXZlbG9wZXIvMTQ2MjhmN2YtNTYzOS1mOGQ0LTk5MjItZmJkNTkxMTE4YzYwIiwic2NvcGVzIjpbImNsYXNoIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9icm9uemUiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTg5LjE1My42Mi4xODYvMzIiXSwidHlwZSI6ImNsaWVudCJ9LHsib3JpZ2lucyI6WyJkZXZlbG9wZXIuY2xhc2hvZmNsYW5zLmNvbSJdLCJ0eXBlIjoiY29ycyJ9XX0.OvqyfXQ9bv1MpDM9vKF7lGOwR0m0KXHvSPgSRjuuPOs96dOCiQLnH-INGxBKzY6DSoBDEJ2CmzVl5rNsYiOp4A",
        },
    }).then((res) => res.json());
    console.log(x);
    res.send(x);
});

app.post('/verifyPlayerToken', async (req, res) => {
    const { user, token } = req.body;
    const x = await fetch(`https://api.clashofclans.com/v1/players/${user.replaceAll('#', '%23')}/verifytoken`, {
        headers: {
            Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjZiNzczODJiLTAwNzYtZTgyMy02NzE2LWMwOGRhZjk1MWUwOCIsImlhdCI6MTcxMDYxNDcxNywiZXhwIjoxNzEwNjE4MzE3LCJzdWIiOiJkZXZlbG9wZXIvMTQ2MjhmN2YtNTYzOS1mOGQ0LTk5MjItZmJkNTkxMTE4YzYwIiwic2NvcGVzIjpbImNsYXNoIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9icm9uemUiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTg5LjE1My42Mi4xODYvMzIiXSwidHlwZSI6ImNsaWVudCJ9LHsib3JpZ2lucyI6WyJkZXZlbG9wZXIuY2xhc2hvZmNsYW5zLmNvbSJdLCJ0eXBlIjoiY29ycyJ9XX0.OvqyfXQ9bv1MpDM9vKF7lGOwR0m0KXHvSPgSRjuuPOs96dOCiQLnH-INGxBKzY6DSoBDEJ2CmzVl5rNsYiOp4A",
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
