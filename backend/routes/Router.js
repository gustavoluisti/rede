const express = require("express");
const router = express();

router.use('/api/users', require('./User.routes.js'));
router.use('/api/photos', require('./Photo.routes'));

router.get('/', (request, response) => {
    response.send("API Working!")
})

module.exports = router;