import {Carousel} from 'antd';
import React from 'react';
import s from './Slider.module.scss';

const slides = [
  {
    className: s.bannerHero,
    eyebrow: 'Welcome to BookStore',
    heading: 'Discover Your Next\nGreat Read',
    sub: "Thousands of titles across every genre — from timeless classics to today's bestsellers.",
    cta: 'Shop Now',
    decoration: '📚'
  },
  {
    className: s.bannerNew,
    eyebrow: 'Just Arrived',
    heading: 'New Arrivals\nThis Week',
    sub: 'Fresh picks curated by our editors. Be the first to explore the latest releases.',
    cta: "See What's New",
    decoration: '✨'
  },
  {
    className: s.bannerSale,
    eyebrow: 'Limited Time',
    heading: 'Up to 30% Off\nSelected Titles',
    sub: "Stock up on your reading list. Deals updated weekly — don't miss out.",
    cta: 'View Deals',
    decoration: '🏷️'
  }
];

export default function Slider() {
  return (
    <div className={s.sliderWrapper}>
      <Carousel autoplay autoplaySpeed={5000} className={s.carousel}>
        {slides.map((slide, i) => (
          <div key={i}>
            <div className={`${s.banner} ${slide.className}`}>
              <div className={s.bannerDecoration}>{slide.decoration}</div>
              <div className={s.bannerContent}>
                <span className={s.eyebrow}>{slide.eyebrow}</span>
                <h2 className={s.heading}>
                  {slide.heading.split('\n').map((line, j) => (
                    <React.Fragment key={j}>
                      {line}
                      {j === 0 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                <p className={s.sub}>{slide.sub}</p>
                <button className={s.cta}>{slide.cta}</button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
