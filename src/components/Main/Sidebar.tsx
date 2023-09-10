import s from './Sidebar.module.scss';
import {useDispatch} from "react-redux";
import {changeCategory} from "@/reducer";
import {useAppSelector} from "@/pages/hooks";

export const CATEGORIES = [
    'Architecture', 'Art & fashion', 'Biography', 'Business', 'Drama', 'Fiction', 'Food & Drink',
    'Health & Wellbeing', 'History & Politics', 'Humor', 'Poetry', 'Psychology', 'Science', 'Technology',
    'Travel & Maps'
]

type TCategory = {
    chooseCategory: () => void;
}

function Sidebar({chooseCategory}: TCategory) {
    const dispatch = useDispatch();
    const chosenCategory = useAppSelector(state => state.category)

    return (
        <div className={s.root}>
            <ul className={s.categoriesList} onClick={chooseCategory}>
                {
                    CATEGORIES.map((category, index) => (
                        <li className={
                            (chosenCategory.id === index && chosenCategory.title)
                            || (category === 'Architecture' && !chosenCategory.title)
                                ? s.chosenCategory
                                : ''} key={index} onClick={() => dispatch(changeCategory(
                            {
                                id: index,
                                title: category,
                            }
                        ))} data-id={index}>{category}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Sidebar;