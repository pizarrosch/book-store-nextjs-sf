import s from "./Navigation.module.scss";
import Link from "next/link";
import Image from "next/image";
import user from "../../../public/assets/user.svg";
import shopBag from "../../../public/assets/shop-bag.svg";

type TShowLogin = {
    handleShowLogin: () => void
}

export default function Navigation({handleShowLogin}: TShowLogin) {
    return (
        <div className={s.root}>
            <nav>
                <ul className={s.nav}>
                    <li>
                        <Link href="/">Books</Link>
                    </li>
                    <li>
                        <Link href="/">Audiobooks</Link>
                    </li>
                    <li>
                        <Link href="/">Stationery & gifts</Link>
                    </li>
                    <li>
                        <Link href="/">Blog</Link>
                    </li>
                </ul>
            </nav>
            <div className={s.accountActionsMenu}>
                <Image src={user} alt={'user'} onClick={handleShowLogin}/>
                <Link href={'/cart'}>
                    <Image src={shopBag} alt={'bag'}/>
                </Link>
                <div className={s.itemsNumber}>1</div>
            </div>
        </div>
    )
}