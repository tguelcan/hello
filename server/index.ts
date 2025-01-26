import express, { Express, Request, Response } from "express";
// @ts-ignore
import { handler } from '../build/handler.js';


const app: Express = express();
const port = process.env.PORT || 3000;

// add a route that lives separately from the SvelteKit app
app.get('/healthcheck', (req, res) => {
	res.end('ok');
});

// redirect every single incoming request to https
app.use((req: Request, res: Response, next) => {
	if (req.headers['x-forwarded-proto'] !== 'https')
		// the statement for performing our redirection
		return res.redirect('https://' + req.headers.host + req.url);
	else return next();
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(port, () => {
	console.log('server running on port ' + port);
});