export default function attachOwnerFilter(req, res, next) {
  // authMiddleware must run before this – we already have req.userId
  // Create a filter object that every controller can spread into its query
  req.ownerFilter = { userId: req.userId };
  next();
}