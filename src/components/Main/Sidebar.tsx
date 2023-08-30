import s from './Sidebar.module.scss';
import cx from 'classnames';

type TCategory = {
    chooseCategory: () => void;
} & TIsChosen

type TIsChosen = {
    isChosen: boolean;
}

function Sidebar({chooseCategory, isChosen}: TCategory) {
    return (
        <div className={s.root}>
            <ul className={s.categoriesList} onClick={chooseCategory}>
                <li className={s.chosenCategory}>Architecture</li>
                <li>Art & fashion</li>
                <li>Biography</li>
                <li>Business</li>
                <li>Drama</li>
                <li>Fiction</li>
                <li>Food & Drink</li>
                <li>Health & Wellbeing</li>
                <li>History & Politics</li>
                <li>Humor</li>
                <li>Poetry</li>
                <li>Psychology</li>
                <li>Science</li>
                <li>Technology</li>
                <li>Travel & Maps</li>
            </ul>
        </div>
    )
}

export default Sidebar;