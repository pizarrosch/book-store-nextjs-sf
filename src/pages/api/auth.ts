import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).send({error: true, message: 'Please just GET'});
        console.log(req.body)
    } else {
        res.status(200).send({
            error: false,
            name: 'Zaur Shomakhov',
            email: 'shomakhov@skillfactory.ru',
            password: 'Zaurskillfactory'
        })
    }
}