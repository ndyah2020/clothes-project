const Product = require('../model/Product')

class ProductController {
    //Hiển thị sản phẩm method: get - http://localhost:3001/category/show
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
    //Tạo sản phẩm mới method: post - /category/create
    create(req, res) {
        const formData = req.body
        //Kiểm tra sản phẩm có sku hoặc tên giống trong database không
        Product.findOne({ $or: [{ sku: formData.sku }, { name: formData.name }] })
        .then(existingProduct => {
            //nếu có trả về sản phẩm đó đồng thời kiểm tra giống nhau thì in ra 
            if(existingProduct){
                if(existingProduct.sku === formData.sku){
                    return res.status(400).json({ message: 'SKU này đã tồn tại' });
                }
                if(existingProduct.name === formData.name){
                    return res.status(400).json({ message: 'Tên đã tồn tại' });
                }
            }
            //Không có thì tạo đối tượng lưu vào database  
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
    //Chỉnh sửa sản phẩm method: put  - http://localhost:3001/category/:id
    update(req, res) {
        const productId = req.params.id
        const updatedData = req.body
        
        Product.findByIdAndUpdate(productId, updatedData)
        .then(() => res.json({updatedData }))
        .catch(error => {
            res.status(500).json({ message: 'Error retrieving products', error });
        });
    }
    //Tìm kiếm sản phẩm theo tên method: get http://localhost:3001/category/search
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
