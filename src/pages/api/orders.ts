import {NextApiResponse} from 'next';
import {isAuthenticated, NextApiRequestWithAuth} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({error: true, message: 'Unauthorized'});
  }

  const userId = req.user!.id;

  if (req.method === 'POST') {
    try {
      const {items, shippingAddress, paymentLast4} = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({error: true, message: 'Items are required'});
      }

      if (!shippingAddress) {
        return res
          .status(400)
          .json({error: true, message: 'Shipping address is required'});
      }

      const {street, city, state, postalCode, country} = shippingAddress;
      if (
        !street?.trim() ||
        !city?.trim() ||
        !state?.trim() ||
        !postalCode?.trim() ||
        !country?.trim()
      ) {
        return res
          .status(400)
          .json({error: true, message: 'All address fields are required'});
      }

      if (!paymentLast4 || !/^\d{4}$/.test(paymentLast4)) {
        return res
          .status(400)
          .json({error: true, message: 'Valid payment info is required'});
      }

      for (const item of items) {
        if (!item.bookId || !item.quantity || item.quantity < 1) {
          return res
            .status(400)
            .json({error: true, message: 'Invalid item data'});
        }
        if (typeof item.price !== 'number' || item.price < 0) {
          return res
            .status(400)
            .json({error: true, message: 'Invalid item price'});
        }
      }

      const totalAmount = items.reduce(
        (sum: number, item: {price: number; quantity: number}) =>
          sum + item.price * item.quantity,
        0
      );

      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId,
            totalAmount,
            shippingStreet: street.trim(),
            shippingCity: city.trim(),
            shippingState: state.trim(),
            shippingPostal: postalCode.trim(),
            shippingCountry: country.trim(),
            paymentLast4,
            items: {
              create: items.map(
                (item: {bookId: string; quantity: number; price: number}) => ({
                  bookId: String(item.bookId),
                  quantity: item.quantity,
                  price: item.price
                })
              )
            }
          },
          include: {
            items: true
          }
        });

        return newOrder;
      });

      return res.status(201).json({
        error: false,
        data: {
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt.toISOString()
        }
      });
    } catch {
      return res
        .status(500)
        .json({error: true, message: 'Failed to create order'});
    }
  }

  if (req.method === 'GET') {
    try {
      const orders = await prisma.order.findMany({
        where: {userId},
        include: {
          items: {
            include: {
              book: {
                select: {
                  title: true,
                  authors: true,
                  thumbnailUrl: true
                }
              }
            }
          }
        },
        orderBy: {createdAt: 'desc'}
      });

      return res.status(200).json({
        error: false,
        data: orders.map((order) => ({
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentLast4: order.paymentLast4,
          createdAt: order.createdAt.toISOString(),
          shippingAddress: {
            street: order.shippingStreet,
            city: order.shippingCity,
            state: order.shippingState,
            postalCode: order.shippingPostal,
            country: order.shippingCountry
          },
          items: order.items.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            price: item.price,
            book: item.book
          }))
        }))
      });
    } catch {
      return res
        .status(500)
        .json({error: true, message: 'Failed to fetch orders'});
    }
  }

  return res.status(405).json({error: true, message: 'Method not allowed'});
}
