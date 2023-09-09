import Sidebar from "@/components/Main/Sidebar";
import s from './Main.module.scss';
import Books from "@/components/Main/Books";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {changeCategory, TCategory} from "@/reducer";
import {CATEGORIES} from "@/components/Main/Sidebar";
import {RootState} from "@reduxjs/toolkit/src/query/core/apiState";

function MainContent() {
    const [isChosen, setIsChosen] = useState(false);
    const [maxResults, setMaxResults] = useState(6);
    const dispatch = useDispatch();

    const chosenCategory = useSelector((state) => state.category)

    function chooseCategory() {
        setMaxResults(6);
    }

    return (
        <div className={s.root}>
            <Sidebar chooseCategory={chooseCategory} />
            <Books category={chosenCategory.title} maxResults={maxResults} setMaxResults={setMaxResults}/>
        </div>

    )
}

export default MainContent;