import s from "@/components/Book/Books.module.scss";
import Image from "next/image";
import filledStar from "../../../public/assets/star-filled.svg";
import unfilledStar from "../../../public/assets/Star.svg";
import React from "react";
import {bookData} from "@/components/Book/Books";
import {TClicked} from "@/reducer";

type BookDetailsProps = bookData & {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    buyIndex: TClicked | undefined
}

export default function BookDetails(details: BookDetailsProps) {
    const {onClick, buyIndex} = details;

    return (
        <div className={s.book_bookInformation}>
            <span className={s.author}>{details.volumeInfo?.authors}</span>
            <h2 className={s.title}>{details.volumeInfo?.title}</h2>
            <div className={s.ratingsWrapper}>
                <div className={s.rating}>
                    <Image src={details.volumeInfo?.averageRating > 0 ? filledStar : unfilledStar} alt="rating"
                           width="12" height="12"/>
                    <Image src={details.volumeInfo?.averageRating > 1 ? filledStar : unfilledStar} alt="rating"
                           width="12" height="12"/>
                    <Image src={details.volumeInfo?.averageRating > 2 ? filledStar : unfilledStar} alt="rating"
                           width="12" height="12"/>
                    <Image src={details.volumeInfo?.averageRating > 3 ? filledStar : unfilledStar} alt="rating"
                           width="12" height="12"/>
                    <Image src={details.volumeInfo?.averageRating > 4 ? filledStar : unfilledStar} alt="rating"
                           width="12" height="12"/>
                </div>
                <span>{
                    details.volumeInfo?.ratingsCount ?
                        `${details.volumeInfo.ratingsCount} ${details.volumeInfo.ratingsCount === 1 ? 'review' : 'reviews'}` :
                        'N/A'}
                            </span>
            </div>
            <p className={s.bookDescription}>{details.volumeInfo?.description || 'No description available'}</p>
            <span
                className={s.price}>{details.saleInfo?.listPrice ? '$' + details.saleInfo?.listPrice.amount : 'out of stock'}</span>
            <button className={
                !details.saleInfo?.listPrice
                    ? s.unavailable
                    : s.button}
                    onClick={onClick}
                    data-id={details.id}
            >
                {!details.saleInfo?.listPrice ? 'unavailable' : buyIndex ? buyIndex.isClicked : 'Buy now'}
            </button>
        </div>
    )
}
