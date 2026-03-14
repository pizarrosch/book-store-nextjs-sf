import {NextApiResponse} from 'next';
import {NextApiRequestWithAuth, isAuthenticated} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized. Please login first'
    });
  }

  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({
      error: true,
      message: 'User ID not found'
    });
  }

  // GET - Fetch user profile
  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: {id: userId}
      });

      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        });
      }

      // Format the response to match Redux structure
      const profileData = {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio || '',
        profilePicture: user.profilePicture || null,
        phone: user.phone || '',
        shippingAddress:
          user.addressStreet ||
          user.addressCity ||
          user.addressState ||
          user.addressPostal ||
          user.addressCountry
            ? {
                street: user.addressStreet || '',
                city: user.addressCity || '',
                state: user.addressState || '',
                postalCode: user.addressPostal || '',
                country: user.addressCountry || ''
              }
            : null,
        createdAt: user.createdAt ? user.createdAt.toISOString() : null
      };

      return res.status(200).json({
        error: false,
        data: profileData
      });
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      return res.status(500).json({
        error: true,
        message: 'An error occurred while fetching profile'
      });
    }
  }

  // PUT - Update user profile
  if (req.method === 'PUT') {
    const {name, bio, phone, shippingAddress} = req.body;

    // Validation
    if (name && name.length < 2) {
      return res.status(400).json({
        error: true,
        message: 'Name must be at least 2 characters long'
      });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({
        error: true,
        message: 'Bio must not exceed 500 characters'
      });
    }

    try {
      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (phone !== undefined) updateData.phone = phone;

      // Handle shipping address
      if (shippingAddress) {
        if (shippingAddress.street !== undefined)
          updateData.addressStreet = shippingAddress.street;
        if (shippingAddress.city !== undefined)
          updateData.addressCity = shippingAddress.city;
        if (shippingAddress.state !== undefined)
          updateData.addressState = shippingAddress.state;
        if (shippingAddress.postalCode !== undefined)
          updateData.addressPostal = shippingAddress.postalCode;
        if (shippingAddress.country !== undefined)
          updateData.addressCountry = shippingAddress.country;
      }

      const updatedUser = await prisma.user.update({
        where: {id: userId},
        data: updateData
      });

      // Format the response
      const profileData = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        bio: updatedUser.bio || '',
        profilePicture: updatedUser.profilePicture,
        phone: updatedUser.phone || '',
        shippingAddress:
          updatedUser.addressStreet ||
          updatedUser.addressCity ||
          updatedUser.addressState ||
          updatedUser.addressPostal ||
          updatedUser.addressCountry
            ? {
                street: updatedUser.addressStreet || '',
                city: updatedUser.addressCity || '',
                state: updatedUser.addressState || '',
                postalCode: updatedUser.addressPostal || '',
                country: updatedUser.addressCountry || ''
              }
            : null,
        createdAt: updatedUser.createdAt.toISOString()
      };

      return res.status(200).json({
        error: false,
        message: 'Profile updated successfully',
        data: profileData
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({
        error: true,
        message: 'An error occurred while updating profile'
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    error: true,
    message: 'Method not allowed'
  });
}
