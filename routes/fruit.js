const library = require('../config/library');
const checkAuth = require('../check-auth');
const Fruit = require('../models/fruit');
const router = library.express.Router();

router.get('', (req, res) => {
    Fruit.find()
        .then(fruits => {
            res.json({
                message: 'Fruits found',
                fruits: fruits
            });
        }).catch(err => {
            console.error(err);
        });
});

router.post('', checkAuth, (req, res) => {
    const fruit = new Fruit({
        id: req.body.id, 
        name: req.body.name
    });

    fruit.save()
        .then(() => {
            res.status(201).json({
                message: 'Fruit created',
                fruit: fruit
            });
        }).catch(err => {
            console.error(err);
        });
})

router.delete('/:id', checkAuth, (req, res) => {
    Fruit.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({ message: 'Fruit Deleted' });
        }).catch(err => {
            console.error(err);
        });
})

module.exports = router