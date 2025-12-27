// Admin dashboard welcome route
export const adminDashboard = (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
};

