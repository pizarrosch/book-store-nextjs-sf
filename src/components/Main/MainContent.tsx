import Sidebar from "@/components/Main/Sidebar";
import s from './Main.module.scss';
import Books from "@/components/Main/Books";
import {useState} from "react";
import {useAppSelector} from "@/pages/hooks";

function MainContent() {
    const [maxResults, setMaxResults] = useState(6);
    const chosenCategory = useAppSelector((state) => state.category);

    function chooseCategory() {
        setMaxResults(6);
    }

    return (
        <div className={s.root}>
            <Sidebar chooseCategory={chooseCategory} />
            <Books category={chosenCategory.title || 'Architecture'} maxResults={maxResults} setMaxResults={setMaxResults}/>
        </div>

    )
}

export default MainContent;