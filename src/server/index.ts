import * as express from 'express';
import * as path from 'path';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.join(__dirname, '../../public')));

app.get('/placeholder', (req, res) => res.send('World!'));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
