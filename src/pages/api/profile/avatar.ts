import {NextApiResponse} from 'next';
import {NextApiRequestWithAuth, isAuthenticated} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) {
  // Only POST method allowed
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: true,
      message: 'Method not allowed'
    });
  }

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

  const {imageData} = req.body;

  if (!imageData) {
    return res.status(400).json({
      error: true,
      message: 'Image data is required'
    });
  }

  // Validate base64 format
  if (!imageData.startsWith('data:image/')) {
    return res.status(400).json({
      error: true,
      message: 'Invalid image format'
    });
  }

  // Check file type (jpg, png, webp)
  const validTypes = ['data:image/jpeg', 'data:image/png', 'data:image/webp'];
  const isValidType = validTypes.some((type) => imageData.startsWith(type));

  if (!isValidType) {
    return res.status(400).json({
      error: true,
      message: 'Invalid file type. Only JPG, PNG, and WEBP are allowed'
    });
  }

  // Check file size (approximate size from base64 string)
  // Base64 increases size by ~33%, so we divide by 1.33 to get approximate original size
  const base64Data = imageData.split(',')[1];
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

  if (sizeInBytes > maxSizeInBytes) {
    return res.status(400).json({
      error: true,
      message: 'Image size must not exceed 2MB'
    });
  }

  try {
    // Update user's profile picture
    const updatedUser = await prisma.user.update({
      where: {id: userId},
      data: {profilePicture: imageData}
    });

    return res.status(200).json({
      error: false,
      message: 'Profile picture updated successfully',
      profilePicture: updatedUser.profilePicture
    });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return res.status(500).json({
      error: true,
      message: 'An error occurred while uploading avatar'
    });
  }
}
