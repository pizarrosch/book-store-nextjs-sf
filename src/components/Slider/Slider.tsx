import banner from '../../../public/assets/banner.png';
import banner2 from '../../../public/assets/banner_2-transformed.png';
import banner3 from '../../../public/assets/banner_3.png';
import arrow from '../../../public/assets/arrow.svg';
import Image, {StaticImageData} from "next/image";
import s from './Slider.module.scss';
import React, {useState} from "react";

const imagesArray: StaticImageData[] = [banner, banner2, banner3];
const dotsArray: number[] = [1 ,2 ,3];

export default function Slider() {
    const [clicked, setClicked] = useState(false);

    function handleClick(e: React.MouseEvent) {
        const target = e.target as HTMLDivElement;
        const dots = document.getElementsByClassName('Slider_violet__7EJyA');
        const slider: HTMLImageElement = document.querySelector('.Slider_image__YpRSC') as HTMLImageElement;

        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.add('Slider_dot__OcXzJ');
            dots[i].classList.remove('Slider_violet__7EJyA');
            target.classList.add('Slider_violet__7EJyA');
            slider.srcset = `${imagesArray[Number(target.dataset.index) - 1].src}`;
            slider.alt = imagesArray[Number(target.dataset.index) - 1].src
        }
    }

    return (
        <div className={s.root}>
            <div className={s.banner}>
                <Image src={banner} alt='banner' className={s.image}/>
            </div>
            <div className={s.bookChangeBox}>
                <span>Change old book on new</span>
                <Image src={arrow} alt='arrow' width="55" height="12"/>
            </div>
            <div className={s.topBooksBox}>
                <span>Top 100 books 2022</span>
                <Image src={arrow} alt='arrow' width="55" height="12"/>
            </div>
            <div className={s.dotsContainer}>
                {dotsArray.map((dot: number, index) => {
                        return (
                            <div
                                key={dot}
                                className={dot === 1 ? s.violet : s.dot}
                                data-index={dot}
                                onClick={handleClick}
                            ></div>
                        )
                    }
                )}
            </div>
        </div>
    )
}