import { NextApiRequest, NextApiResponse } from 'next';

// Store API key securely on the server
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { category, maxResults } = req.query;

    if (!category || !maxResults) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=${API_KEY}&printType=books&startIndex=0&maxResults=${maxResults}&langRestrict=en`
        );

        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ error: 'Failed to fetch books' });
    }
}