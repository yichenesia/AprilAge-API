'use strict';

/// Example
export const index = (req, res) => {
  res.json({
    message: req.user ? 'Hello World. You are authenticated.': 'Hello World. You are not authenticated.'
  });
};