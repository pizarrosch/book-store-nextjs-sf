import Sidebar from "@/components/Drawer/Sidebar";
import s from './Main.module.scss';
import Books from "@/components/Book/Books";
import {useState} from "react";
import {useAppSelector} from "@/pages/hooks";
import MenuDrawer from "@/components/Drawer/MenuDrawer";

function MainContent() {
    const [maxResults, setMaxResults] = useState(6);
    const chosenCategory = useAppSelector((state) => state.category);

    function chooseCategory() {
        setMaxResults(6);
    }

    return (
        <>
            <MenuDrawer />
            <div className={s.root}>
                <Books category={chosenCategory.title || 'Architecture'} maxResults={maxResults} setMaxResults={setMaxResults}/>
            </div>
        </>


    )
}

export default MainContent;