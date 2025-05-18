import noCoverBook from "../../../public/assets/no-cover.jpg";
import s from "@/components/Book/Books.module.scss";
import Image from "next/image";
import React from "react";
import {bookData} from "@/components/Book/Books";

export default function CoverImage(data: bookData) {
    return (
        <Image src={data.volumeInfo?.imageLinks ? data.volumeInfo.imageLinks.thumbnail : noCoverBook}
           alt="book-cover" className={s.bookCover} width={212} height={287}/>
    )
}