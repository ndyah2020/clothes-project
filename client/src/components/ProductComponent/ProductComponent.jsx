import React, { useState} from 'react';


import {
    Container,
    ButtonGroup,
    FilterButton,
    ProductList,
} from './style'; 

import CardComponen from '../CardComponent/CardComponent';
import PaginationComponent from '../PaginationComponent/PaginationComponent'
const products = [
    // 20 sản phẩm Áo Thun
    { id: 1, name: 'Áo Thun Nam Trơn', category: 'AoThun', price: '250,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 2, name: 'Áo Thun Tay Ngắn', category: 'AoThun', price: '230,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 3, name: 'Áo Thun Nữ Cá Tính', category: 'AoThun', price: '220,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 4, name: 'Áo Thun Họa Tiết', category: 'AoThun', price: '280,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 5, name: 'Áo Thun Form Rộng', category: 'AoThun', price: '300,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 6, name: 'Áo Thun Nữ Dáng Ôm', category: 'AoThun', price: '270,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 7, name: 'Áo Thun Cổ Tròn', category: 'AoThun', price: '260,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 8, name: 'Áo Thun Unisex', category: 'AoThun', price: '320,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 9, name: 'Áo Thun Đơn Giản', category: 'AoThun', price: '210,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 10, name: 'Áo Thun In Chữ', category: 'AoThun', price: '240,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 11, name: 'Áo Thun Nam Họa Tiết', category: 'AoThun', price: '290,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 12, name: 'Áo Thun Polo', category: 'AoThun', price: '350,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 13, name: 'Áo Thun Nam Basic', category: 'AoThun', price: '260,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 14, name: 'Áo Thun Kẻ Sọc', category: 'AoThun', price: '270,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 15, name: 'Áo Thun Tay Dài', category: 'AoThun', price: '330,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 16, name: 'Áo Thun Dáng Suông', category: 'AoThun', price: '240,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 17, name: 'Áo Thun Nam Oversize', category: 'AoThun', price: '310,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 18, name: 'Áo Thun Nam Slimfit', category: 'AoThun', price: '280,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 19, name: 'Áo Thun Thể Thao', category: 'AoThun', price: '290,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 20, name: 'Áo Thun Cổ Tim', category: 'AoThun', price: '270,000 VND', image:'/assets/image/products/hamster.jpg' },

    // 20 sản phẩm Áo Sơ Mi
    { id: 21, name: 'Áo Sơ Mi Nam Trắng', category: 'AoSoMi', price: '350,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 22, name: 'Áo Sơ Mi Nữ Họa Tiết', category: 'AoSoMi', price: '360,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 23, name: 'Áo Sơ Mi Công Sở', category: 'AoSoMi', price: '380,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 24, name: 'Áo Sơ Mi Denim', category: 'AoSoMi', price: '400,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 25, name: 'Áo Sơ Mi Tay Ngắn', category: 'AoSoMi', price: '330,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 26, name: 'Áo Sơ Mi Cổ Nhọn', category: 'AoSoMi', price: '350,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 27, name: 'Áo Sơ Mi Nữ Dáng Ôm', category: 'AoSoMi', price: '370,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 28, name: 'Áo Sơ Mi Nam Họa Tiết', category: 'AoSoMi', price: '360,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 29, name: 'Áo Sơ Mi Dễ Phối', category: 'AoSoMi', price: '340,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 30, name: 'Áo Sơ Mi Nữ Cách Điệu', category: 'AoSoMi', price: '380,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 31, name: 'Áo Sơ Mi Nam Slimfit', category: 'AoSoMi', price: '390,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 32, name: 'Áo Sơ Mi Kẻ Sọc', category: 'AoSoMi', price: '370,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 33, name: 'Áo Sơ Mi Cổ Tàu', category: 'AoSoMi', price: '360,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 34, name: 'Áo Sơ Mi Nữ Form Rộng', category: 'AoSoMi', price: '380,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 35, name: 'Áo Sơ Mi Nam Học Sinh', category: 'AoSoMi', price: '340,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 36, name: 'Áo Sơ Mi Nữ Thời Trang', category: 'AoSoMi', price: '400,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 37, name: 'Áo Sơ Mi Nam Hàn Quốc', category: 'AoSoMi', price: '380,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 38, name: 'Áo Sơ Mi Nữ Ngắn Tay', category: 'AoSoMi', price: '360,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 39, name: 'Áo Sơ Mi Họa Tiết Trẻ Trung', category: 'AoSoMi', price: '390,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 40, name: 'Áo Sơ Mi Thể Thao', category: 'AoSoMi', price: '370,000 VND', image:'/assets/image/products/hamster.jpg' },

    // 20 sản phẩm Áo Khoác
    { id: 41, name: 'Áo Khoác Gió Nam', category: 'AoKhoac', price: '500,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 42, name: 'Áo Khoác Nữ Dù', category: 'AoKhoac', price: '520,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 43, name: 'Áo Khoác Jeans', category: 'AoKhoac', price: '550,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 44, name: 'Áo Khoác Da', category: 'AoKhoac', price: '600,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 45, name: 'Áo Khoác Nam Cổ Lông', category: 'AoKhoac', price: '700,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 46, name: 'Áo Khoác Nữ Form Dài', category: 'AoKhoac', price: '650,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 47, name: 'Áo Khoác Hoodie', category: 'AoKhoac', price: '590,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 48, name: 'Áo Khoác Bông', category: 'AoKhoac', price: '640,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 49, name: 'Áo Khoác Chống Nước', category: 'AoKhoac', price: '670,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 50, name: 'Áo Khoác Nam Thời Trang', category: 'AoKhoac', price: '620,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 51, name: 'Áo Khoác Nữ Phong Cách', category: 'AoKhoac', price: '590,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 52, name: 'Áo Khoác Năng Động', category: 'AoKhoac', price: '600,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 53, name: 'Áo Khoác Dài', category: 'AoKhoac', price: '650,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 54, name: 'Áo Khoác Nam Thể Thao', category: 'AoKhoac', price: '570,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 55, name: 'Áo Khoác Nữ Năng Động', category: 'AoKhoac', price: '620,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 56, name: 'Áo Khoác Da Nữ', category: 'AoKhoac', price: '680,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 57, name: 'Áo Khoác Nam Chống Nắng', category: 'AoKhoac', price: '590,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 58, name: 'Áo Khoác Lông Cừu', category: 'AoKhoac', price: '700,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 59, name: 'Áo Khoác Thời Trang', category: 'AoKhoac', price: '650,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 60, name: 'Áo Khoác Cực Dễ Phối', category: 'AoKhoac', price: '620,000 VND', image:'/assets/image/products/hamster.jpg' },

    // 20 sản phẩm Quần Jean
    { id: 61, name: 'Quần Jean Nam Trơn', category: 'QuanJean', price: '450,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 62, name: 'Quần Jean Nữ Dáng Ôm', category: 'QuanJean', price: '480,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 63, name: 'Quần Jean Rách', category: 'QuanJean', price: '500,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 64, name: 'Quần Jean Ôm', category: 'QuanJean', price: '520,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 65, name: 'Quần Jean Nam Dài', category: 'QuanJean', price: '540,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 66, name: 'Quần Jean Nữ Cạp Cao', category: 'QuanJean', price: '500,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 67, name: 'Quần Jean Thể Thao', category: 'QuanJean', price: '550,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 68, name: 'Quần Jean Tôn Dáng', category: 'QuanJean', price: '580,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 69, name: 'Quần Jean Chống Nước', category: 'QuanJean', price: '600,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 70, name: 'Quần Jean Cổ Điển', category: 'QuanJean', price: '560,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 71, name: 'Quần Jean Nữ Thời Trang', category: 'QuanJean', price: '540,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 72, name: 'Quần Jean Nam Thời Trang', category: 'QuanJean', price: '580,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 73, name: 'Quần Jean Nữ Cạp Cao', category: 'QuanJean', price: '530,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 74, name: 'Quần Jean Nam Dáng Suông', category: 'QuanJean', price: '550,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 75, name: 'Quần Jean Đen', category: 'QuanJean', price: '570,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 76, name: 'Quần Jean Dài', category: 'QuanJean', price: '590,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 77, name: 'Quần Jean Nữ Họa Tiết', category: 'QuanJean', price: '600,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 78, name: 'Quần Jean Nam Slimfit', category: 'QuanJean', price: '620,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 79, name: 'Quần Jean Nữ Cơ Bản', category: 'QuanJean', price: '640,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 80, name: 'Quần Jean Năng Động', category: 'QuanJean', price: '650,000 VND', image:'/assets/image/products/hamster.jpg' },

    // 20 sản phẩm Quần Tây
    { id: 81, name: 'Quần Tây Nam Trắng', category: 'QuanTay', price: '600,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 82, name: 'Quần Tây Nữ Họa Tiết', category: 'QuanTay', price: '620,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 83, name: 'Quần Tây Công Sở', category: 'QuanTay', price: '640,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 84, name: 'Quần Tây Dáng Ôm', category: 'QuanTay', price: '650,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 85, name: 'Quần Tây Nam Đen', category: 'QuanTay', price: '670,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 86, name: 'Quần Tây Nữ Trắng', category: 'QuanTay', price: '690,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 87, name: 'Quần Tây Nữ Dáng Suông', category: 'QuanTay', price: '700,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 88, name: 'Quần Tây Nam Cổ Điển', category: 'QuanTay', price: '720,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 89, name: 'Quần Tây Nữ Thời Trang', category: 'QuanTay', price: '740,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 90, name: 'Quần Tây Nam Slimfit', category: 'QuanTay', price: '750,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 91, name: 'Quần Tây Dễ Phối', category: 'QuanTay', price: '770,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 92, name: 'Quần Tây Nữ Hàn Quốc', category: 'QuanTay', price: '780,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 93, name: 'Quần Tây Nam Cạp Cao', category: 'QuanTay', price: '800,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 94, name: 'Quần Tây Nữ Trẻ Trung', category: 'QuanTay', price: '810,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 95, name: 'Quần Tây Cổ Điển', category: 'QuanTay', price: '830,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 96, name: 'Quần Tây Nữ Đen', category: 'QuanTay', price: '840,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 97, name: 'Quần Tây Nam Hàn Quốc', category: 'QuanTay', price: '860,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 98, name: 'Quần Tây Nữ Slimfit', category: 'QuanTay', price: '870,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 99, name: 'Quần Tây Dáng Rộng', category: 'QuanTay', price: '880,000 VND', image:'/assets/image/products/hamster.jpg' },
    { id: 100, name: 'Quần Tây Nữ Dễ Phối', category: 'QuanTay', price: '900,000 VND', image:'/assets/image/products/hamster.jpg' },
];


const ProductComponent = () => {
    const [category, setCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 4; // Số sản phẩm mỗi trang
    // Lọc sản phẩm theo danh mục
    const filteredProducts = products.filter(
        (product) => category === 'all' || product.category === category
    );

    // Phân trang sản phẩm
    const displayedProducts = filteredProducts.slice(
        currentPage * productsPerPage,
        (currentPage + 1) * productsPerPage
    );

    // Tổng số trang
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
    
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const handleFilterClick = (selectedCategory) => {
        setCategory(selectedCategory);
        setCurrentPage(0);
    };
    
    return (
        <Container>
            <ButtonGroup>
                <FilterButton $active={category === 'all'} onClick={() => handleFilterClick('all')}>
                    Tất cả
                </FilterButton>
                <FilterButton $active={category === 'AoThun'} onClick={() => handleFilterClick('AoThun')}>
                    Áo thun
                </FilterButton>
                <FilterButton $active={category === 'AoSoMi'} onClick={() => handleFilterClick('AoSoMi')}>
                    Áo sơ mi
                </FilterButton>
                <FilterButton $active={category === 'AoKhoac'} onClick={() => handleFilterClick('AoKhoac')}>
                    Áo khoát
                </FilterButton>
                <FilterButton $active={category === 'QuanTay'} onClick={() => handleFilterClick('QuanTay')}>
                    Quần Tây
                </FilterButton>
                <FilterButton $active={category === 'QuanJean'} onClick={() => handleFilterClick('QuanJean')}>
                    Quần Jean
                </FilterButton>
            </ButtonGroup>

            <ProductList>
                {displayedProducts.map((product) => (
                    <CardComponen key={product.id} product={product} />
                ))}
            </ProductList>

            {/* Phân trang */}
            <PaginationComponent pageCount={pageCount} handlePageClick={handlePageClick} />

        </Container>
    );
};

export default ProductComponent;
