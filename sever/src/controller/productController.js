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
        Product.findOne({ $or: [{ sku: formData.sku }, { name: formData.name }] })
        .then(existingProduct => {
            if(existingProduct){
                if(existingProduct.sku === formData.sku){
                    return res.status(400).json({ message: 'SKU này đã tồn tại' });
                }
                if(existingProduct.name === formData.name){
                    return res.status(400).json({ message: 'Tên đã tồn tại' });
                }
            }
            const product = new Product(formData)
            return product.save()
        })
        .then(saveProduct =>{
            if(saveProduct){
                return res.status(200).json(saveProduct)
            }
        })
        .catch(error => res.status(500).json({ message: 'Thêm sản phẩm thất bại', error }))
    }
    
    update(req, res) {
        const productId = req.params.id
        const updatedData = req.body
        
        Product.findByIdAndUpdate(productId, updatedData)
        .then(() => res.json({updatedData }))
        .catch(error => {
            res.status(500).json({ message: 'Error retrieving products', error });
        });
    }

    search(req, res) {
        Product.find(req.params.name)
        .then((product) => {
            res.json(product)
        })
        .catch(error => {
            res.status(500).json({ message: 'Error retrieving products', error });
        });
    }
}

module.exports = new ProductController();
