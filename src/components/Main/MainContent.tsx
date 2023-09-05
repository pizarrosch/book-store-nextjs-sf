import Sidebar from "@/components/Main/Sidebar";
import s from './Main.module.scss';
import Books from "@/components/Main/Books";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {changeCategory} from "@/reducer";

function MainContent() {
    const category = useSelector(state => state.category);
    const [isChosen, setIsChosen] = useState(false);
    const dispatch = useDispatch();

    function chooseCategory(e: MouseEvent) {
        const target = e.target as HTMLLIElement;
        dispatch(changeCategory(target.innerHTML))
        if (target.innerHTML === category) {
            target.classList.add('Sidebar_chosenCategory__P4evR')
        }
    }

    return (
        <div className={s.root}>
            <Sidebar chooseCategory={chooseCategory} />
            <Books category={category} />
        </div>

    )
}

export default MainContent;