import {useDispatch} from 'react-redux';
import {useAppSelector} from '@/pages/hooks';
import {changeCategory} from '@/reducer';
import s from './Sidebar.module.scss';

export const CATEGORIES = [
  'Architecture',
  'Art & fashion',
  'Biography',
  'Business',
  'Drama',
  'Fiction',
  'Food & Drink',
  'Health & Wellbeing',
  'History & Politics',
  'Humor',
  'Poetry',
  'Psychology',
  'Science',
  'Technology',
  'Travel & Maps'
];

type TCategory = {
  chooseCategory: () => void;
};

function Sidebar({chooseCategory}: TCategory) {
  const dispatch = useDispatch();
  const chosenCategory = useAppSelector((state) => state.category);

  return (
    <aside className={s.root} aria-label="Book categories">
      <h1 id="categories-heading">Categories</h1>
      <ul
        className={s.categoriesList}
        onClick={chooseCategory}
        role="listbox"
        aria-labelledby="categories-heading"
        aria-activedescendant={`category-${chosenCategory.id}`}
      >
        {CATEGORIES.map((category, index) => {
          const isActive =
            (chosenCategory.id === index && chosenCategory.title) ||
            (category === 'Architecture' && !chosenCategory.title);

          return (
            <li
              id={`category-${index}`}
              className={isActive ? s.chosenCategory : ''}
              key={index}
              onClick={() =>
                dispatch(
                  changeCategory({
                    id: index,
                    title: category
                  })
                )
              }
              role="option"
              aria-selected={isActive}
              tabIndex={0}
              data-id={index}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  dispatch(
                    changeCategory({
                      id: index,
                      title: category
                    })
                  );
                }
              }}
            >
              {category}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
