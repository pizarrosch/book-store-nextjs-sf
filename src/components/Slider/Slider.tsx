import banner from '../../../public/assets/banner.png';
import banner2 from '../../../public/assets/banner_2-transformed 1.png';
import banner3 from '../../../public/assets/banner 3.png';
import arrow from '../../../public/assets/arrow.svg';
import Image from "next/image";
import s from './Slider.module.scss';
import {useState} from "react";

const imagesArray = [banner, banner2, banner3];
const dotsArray: string[] = [];

export default function Slider() {
    const [clicked, setClicked] = useState(false);

    function handleClick(e: MouseEvent) {
        const target = e.target as HTMLDivElement;
        dotsArray.map((dot, index) => {
            if(Number(target.dataset.index) === index) {
                setClicked(true);
            }
        })
    }

    return (
        <>
            <div className={s.banner}>
                <Image src={banner} alt='banner' className={s.image}/>
                <Image src={banner2} alt='banner2' className={s.image}/>
                <Image src={banner3} alt='banner3' className={s.image}/>
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
                {imagesArray.map((dot, index) => {
                        dotsArray.push('Hello');
                        return (
                            <div
                                className={clicked ? s.violet : s.dot}
                                data-index={index}
                                onClick={handleClick}
                            ></div>
                        )
                    }
                )}
            </div>
        </>
    )
}