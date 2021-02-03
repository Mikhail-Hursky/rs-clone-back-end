import {Router} from 'express';
import fetch from 'node-fetch';
import { getById } from '../storage/mongoDB';

const router = Router();

const {client_id, client_secret} = process.env

router.get('/github/:code', async (req, res) => {
    const code = req.params['code'];
    console.log(code)
    const token = await getAccessToken(code);
    console.log(token);
    const gitHubData = await getGitHubUser(token);
    if ("Bad credentials" === gitHubData.message) {
        res.json({status: 404, message: 'Not found'});
    } else {
        const user = await getById(gitHubData.node_id, gitHubData);
        res.json(user);
    }
});

async function getAccessToken(code) {
    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id,
            client_secret,
            code
        })
    });
    const data = await res.text();
    const params = new URLSearchParams(data);
    return params.get('access_token');
}

async function getGitHubUser(access_token) {
    const req = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    })
    return req.json();
}

export default router;
