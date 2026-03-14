import {NextApiResponse} from 'next';
import {
  NextApiRequestWithAuth,
  isAuthenticated,
  verifyPassword,
  hashPassword
} from '@/lib/auth';
import {prisma} from '@/lib/prisma';

export default async function handler(
  req: NextApiRequestWithAuth,
  res: NextApiResponse
) {
  // Only PATCH method allowed
  if (req.method !== 'PATCH') {
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

  const {currentPassword, newPassword, confirmPassword} = req.body;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      error: true,
      message: 'All password fields are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      error: true,
      message: 'New password must be at least 6 characters long'
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      error: true,
      message: 'New password and confirmation do not match'
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      error: true,
      message: 'New password must be different from current password'
    });
  }

  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: {
        id: true,
        password: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await verifyPassword(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        error: true,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: {id: userId},
      data: {password: hashedNewPassword}
    });

    return res.status(200).json({
      error: false,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({
      error: true,
      message: 'An error occurred while changing password'
    });
  }
}
