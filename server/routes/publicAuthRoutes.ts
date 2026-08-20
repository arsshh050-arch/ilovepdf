import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// Public Google Sign-In Token Verification
router.post('/google/verify', async (req, res) => {
  const { credential, accessToken } = req.body || {};

  if (!credential && !accessToken) {
    return res.status(400).json({
      success: false,
      error: 'Missing Google credential or access token.',
    });
  }

  try {
    let googleUser: any = null;

    if (credential) {
      // Decode / verify Google JWT token via Google Tokeninfo endpoint
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      const tokenInfo: any = await verifyRes.json();

      if (!verifyRes.ok || tokenInfo.error) {
        return res.status(401).json({
          success: false,
          error: tokenInfo.error_description || 'Invalid Google ID token.',
        });
      }

      googleUser = {
        id: tokenInfo.sub,
        email: tokenInfo.email,
        name: tokenInfo.name || tokenInfo.email.split('@')[0],
        picture: tokenInfo.picture || '',
        emailVerified: tokenInfo.email_verified === 'true' || tokenInfo.email_verified === true,
      };
    } else if (accessToken) {
      // Verify via Google Userinfo endpoint
      const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile: any = await userRes.json();

      if (!userRes.ok || !profile.sub) {
        return res.status(401).json({
          success: false,
          error: 'Failed to authenticate Google user token.',
        });
      }

      googleUser = {
        id: profile.sub,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        picture: profile.picture || '',
        emailVerified: profile.email_verified === true,
      };
    }

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({
        success: false,
        error: 'Unable to extract verified email from Google identity.',
      });
    }

    // Return safe user profile for client auth state
    return res.json({
      success: true,
      user: {
        id: `usr_${googleUser.id.substring(0, 12)}`,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
        provider: 'google',
        role: 'user',
        plan: 'free',
        createdAt: new Date().toISOString(),
      },
      token: `jwt_gauth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    });
  } catch (err: any) {
    console.error('Google public login error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while verifying Google login.',
    });
  }
});

export default router;
