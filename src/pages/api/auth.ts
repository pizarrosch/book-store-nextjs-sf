// import { NextApiRequest, NextApiResponse } from 'next';
//
// export default async function handler(req: any, res: NextApiResponse) {
//     if (req.status !== 'POST') {
//         res.status(405).send({ error: true, message: 'Only POST' })
//     }
//
//     const { email, password } = req.body;
//
//     function validate(email, password): boolean {
//         if (email.contains('@')) return true;
//         if (password.length < 6) return false;
//     }
//
//     const validatedInfo = validate(email, password);
//
//     if (validatedInfo.error) {
//         res.status(400).send({ error: true, message: 'Email or password are incorrect' });
//     } else {
//         res.status(200).send({ success: true, token: 'testToken' });
//     }
// }