const ProductModel = require("../model/Product");

class ProductController {
  // Lấy tất cả sản phẩm
  async getProducts(req, res) {
    try {
      const products = await ProductModel.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  }

  // Lấy thông tin chi tiết của một sản phẩm theo ID
  async getProductById(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductModel.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving product", error });
    }
  }

  // Tạo mới sản phẩm
  async createProduct(req, res) {
    try {
      const { sku, name, category, sizes, status, description } = req.body;

      // Xử lý hình ảnh từ `req.files` (nếu có)
      const images = req.files?.map((file) => ({
        data: file.buffer.toString("base64"),
        contentType: file.mimetype,
      }));
      const newProduct = new ProductModel({
        sku,
        name,
        category,
        sizes,
        status,
        description, // Thêm trường description
        images, // Lưu hình ảnh nếu có
      });
      await newProduct.save();
      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error });
    }
  }
  //cap nhat them size vao san pham
  async addSize(req, res) {
    const { id } = req.params;
    const { size } = req.body;
    const upperSize = size.toUpperCase();
    try {
      const product = await ProductModel.findById(id);
      // Kiểm tra nếu size đã tồn tại
      const existingSize = product.sizes.find((s) => s.size.toUpperCase() === upperSize);
      if (existingSize) {
        return res.status(400).json({ message: "Size already exists" });
      }
      // Thêm size mới
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        {
          $push: {
            sizes: {
              size,
              quantity: 0,
              price: 0,
              type: "letter",
            },
          },
        },
        { new: true, runValidators: true }
      );
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error adding size to product", error });
    }
  }
//Xóa size 
  async deleteSize(req, res) {
    const { id } = req.params;
    const { size } = req.body;
    const upperSize = size.toUpperCase();
    try {
      const deleteSizes = await ProductModel.findByIdAndUpdate(
        id,
        {
            $pull: {sizes:{size:upperSize}}
        },
        {new: true, runValidators: true}
      );
      res.status(200).json(deleteSizes)
    }catch (error) {
      res.status(500).json({ message: "Error deleting size", error });
    }
  }

  // Cập nhật thông tin sản phẩm theo ID
  async updateProduct(req, res) {
    const { id } = req.params;

    try {
      const {
        sku,
        name,
        description, // Thêm trường description
        brand,
        category,
        color,
        sizes,
        discount,
        status,
        tags,
        supplier,
      } = req.body;

      // Xử lý hình ảnh từ `req.files` nếu có
      let images;
      if (req.files && req.files.length > 0) {
        images = req.files.map((file) => ({
          data: file.buffer.toString("base64"),
          contentType: file.mimetype,
        }));
      }

      // Cập nhật các trường thông tin sản phẩm
      const updatedFields = {
        sku,
        name,
        description, // Thêm trường description vào các trường cập nhật
        brand,
        category,
        color,
        sizes,
        discount,
        status,
        tags,
        supplier,
      };

      // Chỉ thêm trường `images` nếu có tệp mới được tải lên
      if (images) {
        updatedFields.images = images;
      }
      
      // Loại bỏ các trường không có giá trị (undefined)
      Object.keys(updatedFields).forEach(
        (key) => updatedFields[key] === undefined && delete updatedFields[key]
      );

      // Tìm và cập nhật sản phẩm
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error });
    }
  }

  // Xóa một sản phẩm theo ID
  async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  }

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(req, res) {
    const { category } = req.params;

    try {
      const products = await ProductModel.find({ category });
      res.status(200).json(products);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching products by category", error });
    }
  }

  // Lấy sản phẩm theo trạng thái
  async getProductsByStatus(req, res) {
    const { status } = req.params;

    try {
      const products = await ProductModel.find({ status });
      res.status(200).json(products);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching products by status", error });
    }
  }
}

module.exports = new ProductController();
