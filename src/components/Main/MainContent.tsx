import Sidebar from "@/components/Main/Sidebar";
import s from './Main.module.scss';
import Books from "@/components/Main/Books";
import {useState} from "react";

function MainContent() {
    const [category, setCategory] = useState('Architecture');
    const [isChosen, setIsChosen] = useState(false);

    function chooseCategory(e: MouseEvent) {
        const target = e.target as HTMLLIElement;
        setCategory(target.innerHTML);

        return target.className ==='chosenCategory' ? target.className === null : target.className === 'chosenCategory'
    }

    return (
        <div className={s.root}>
            <Sidebar chooseCategory={chooseCategory} isChosen={isChosen}/>
            <Books category={category} />
        </div>

    )
}

export default MainContent;