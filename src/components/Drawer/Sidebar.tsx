import {useEffect, useRef, useState} from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCategory = chosenCategory.title || 'Architecture';

  const filteredCategories = CATEGORIES.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleCategorySelect = (index: number, category: string) => {
    dispatch(
      changeCategory({
        id: index,
        title: category
      })
    );
    chooseCategory();
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={s.dropdownContainer} ref={dropdownRef}>
      <button
        className={s.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Filter by category"
      >
        <span className={s.filterIcon} aria-hidden="true">
          🏷️
        </span>
        <span className={s.dropdownLabel}>
          <span className={s.labelText}>Category:</span>
          <span className={s.selectedCategory}>{currentCategory}</span>
        </span>
        <span className={`${s.chevron} ${isOpen ? s.chevronOpen : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={s.dropdownMenu} role="listbox" aria-label="Book categories">
          <div className={s.dropdownSearch}>
            <input
              type="text"
              placeholder="Search categories..."
              className={s.searchInput}
              id="category-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          <ul className={s.categoriesList}>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const index = CATEGORIES.indexOf(category);
                const isActive =
                  (chosenCategory.id === index && chosenCategory.title) ||
                  (category === 'Architecture' && !chosenCategory.title);

                return (
                  <li
                    id={`category-${index}`}
                    className={isActive ? s.chosenCategory : ''}
                    key={index}
                    onClick={() => handleCategorySelect(index, category)}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCategorySelect(index, category);
                      }
                    }}
                  >
                    {isActive && <span className={s.checkmark}>✓</span>}
                    {category}
                  </li>
                );
              })
            ) : (
              <li className={s.noResults}>No categories found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
