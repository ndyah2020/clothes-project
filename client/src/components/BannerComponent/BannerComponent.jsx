import React from 'react'
import { CarouselContainer } from './style';
import { Carousel } from 'antd'

const arrImage = [
    { id: 1, Image: '/assets/image/banner/banner1.jpg' },
    { id: 2, Image: '/assets/image/banner/banner2.jpg' },
];
const BannerComponent = () => {
  return (
    <CarouselContainer>
        <Carousel autoplay>
            {
                arrImage.map( Image => {
                        return (
                            <div key={Image.id} className="carousel-item">
                                <img src={Image.Image} alt="Fashion 1" />
                            </div>
                        )
                    }
                )
            }
        </Carousel>
    </CarouselContainer>
  )
}

export default BannerComponent