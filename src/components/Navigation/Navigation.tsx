import s from "./Navigation.module.scss";
import Link from "next/link";
import Image from "next/image";
import user from "../../../public/assets/user.svg";
import shopBag from "../../../public/assets/shop-bag.svg";

export default function Navigation() {
    return (
        <div className={s.root}>
            <nav>
                <ul className={s.nav}>
                    <li>
                        <Link href="/">Books</Link>
                    </li>
                    <li>
                        <Link href="/description">Audiobooks</Link>
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
                <Image src={user} alt={'user'}/>
                <Link href={'/cart'}>
                    <Image src={shopBag} alt={'bag'}/>
                </Link>
                <div className={s.itemsNumber}>1</div>
            </div>
        </div>
    )
}