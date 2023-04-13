module.exports = function getItemMiddleware(field, itemName, mongooseModel) {
  return async function (req, res, next) {
    const id = req.params.id;
    let item;
    try {
      item = await mongooseModel.findById(id);
      if (!item) {
        return res
          .status(404)
          .json({ message: `Couldn't find ${itemName} with id ${id}` });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
    res[field] = item;
    next();
  }
}