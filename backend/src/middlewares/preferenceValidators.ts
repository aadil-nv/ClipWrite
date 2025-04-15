import { body } from 'express-validator';
import { ALLOWED_PREFERENCES } from '../constants/profile.constants';

export const validatePreferenceChange = [
  body('preferences')
    .isArray({ min: 1 })
    .withMessage('Preferences must be a non-empty array.'),

  body('preferences.*')
    .isString()
    .custom((pref) => ALLOWED_PREFERENCES.includes(pref))
    .withMessage('Invalid preference selected.'),
];
