import {useDispatch} from "react-redux";
import {setEmail, setPassword} from "@/reducer";

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.status(405).send({error: true, message: 'Please just POST'})
    } else {
        res.status(200).send({error: false, message: 'It is a success!'})
    }
    // const dispatch = useDispatch();
    //
    // const {email, password} = req.body;
    //
    // async function validate(email: string, password: string) {
    //     if (email.includes('@') && password.length > 6) {
    //         await dispatch(setEmail(email));
    //         await dispatch(setPassword(password));
    //     } else {
    //         return new Error('Please enter right!') as Error
    //     }
    // }
    //
    // const validatedInfo = validate(email, password);
    //
    // if (validatedInfo) {
    //     res.status(200).send({success: true, token: 'Success!'});
    // } else {
    //     res.status(400).send({error: true, message: 'Email or password are incorrect'});
    // }
}