const Product = require('../model/Product')

class ProductController {
    show(req, res) {
        Product.find({})
            .then(products => {
                console.log(products)
                res.json(products);  
            })
            .catch(error => {
                res.status(500).json({ message: 'Error retrieving products', error });
            });
    }
    create(req, res) {
        const formData = req.body
        
        const product = new Product(formData)
        product.save()
        .then(() => res.send('Them roi do cu'))
        .catch(next)
    }
}

module.exports = new ProductController();
