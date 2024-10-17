import SignInComponent from "../components/SignInComponent/SignInComponent";
import SignUpComponent from "../components/SignUpComponent/SignUpComponent";
import CategoryPage from "../pages/CategoryPage/CategoryPage";
import ContractPage from "../pages/ContractPage/ContractPage";
import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsDetail from "../pages/ProductsDetail/ProductsDetail";
import ProductsPage from "../pages/ProductsPage/ProductsPage";

export const  routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/products',
        page:  ProductsPage,
        isShowHeader: true
    },
    {
        path: '/category/show',
        page:  CategoryPage,
        isShowHeader: true
    },
    {
        path: '/contract',
        page: ContractPage,
        isShowHeader: true
    },
    {
        path: '/product-detail',
        page: ProductsDetail,
        isShowHeader: true
    },
    {
        path: '/Signin',
        page: SignInComponent,                        
        isShowHeader: true
    },
    {
        path: '/Signup',
        page: SignUpComponent,                        
        isShowHeader: true
    },
    {
        path: '*',
        page:  NotFoundPage,
        isShowHeader: false
    },
    
    
]

