export const deliveryDashboard = (req, res) => {
  res.json({
    message: "Welcome Delivery Partner",
    user: req.user
  });
};

export const deliveryTasks = (req, res) => {
  res.json({ message: "Delivery tasks will come here" });
};
