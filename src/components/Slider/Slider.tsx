import {Carousel} from 'antd';
import Image from 'next/image';
import React from 'react';
import banner from '../../../public/assets/Sales-influencers-tell-us-the-books-that-changed-how-they-sell.webp';
import banner2 from '../../../public/assets/banner_2-transformed.png';
import banner3 from '../../../public/assets/banner_3.png';
import s from './Slider.module.scss';

export default function Slider() {
  return (
    <div className={s.root}>
      <Carousel autoplay style={{width: '100%'}}>
        <div className={s.banner}>
          <Image src={banner} alt="banner" />
        </div>
        <div className={s.banner}>
          <Image src={banner2} alt="banner2" />
        </div>
        <div className={s.banner}>
          <Image src={banner3} alt="banner3" />
        </div>
      </Carousel>
    </div>
  );
}
