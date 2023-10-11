const library = require('../config/library');

const fruitSchema = library.mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }
});

module.exports = library.mongoose.model('Fruit', fruitSchema);