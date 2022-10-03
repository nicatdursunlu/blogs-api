const notFound = (_, res) => {
  res.status(404).send({
    message: 'Request URL not found',
  })
}

module.exports = notFound
