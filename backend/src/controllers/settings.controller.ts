import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import Setting from '../models/Setting';

export const getSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    let setting = await Setting.findOne({ userId: req.user.id });
    if (!setting) {
      setting = new Setting({ userId: req.user.id });
      await setting.save();
    }

    return res.status(200).json({
      success: true,
      setting,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { defaultView, enableAutoScan, theme } = req.body;

    let setting = await Setting.findOne({ userId: req.user.id });
    if (!setting) {
      setting = new Setting({ userId: req.user.id });
    }

    if (defaultView !== undefined) setting.defaultView = defaultView;
    if (enableAutoScan !== undefined) setting.enableAutoScan = enableAutoScan;
    if (theme !== undefined) setting.theme = theme;

    await setting.save();

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      setting,
    });
  } catch (error) {
    next(error);
  }
};
export default { getSettings, updateSettings };
