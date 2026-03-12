import {useState} from 'react';
import Books from '@/components/Book/Books';
import Sidebar from '@/components/Drawer/Sidebar';
import {useAppSelector} from '@/pages/hooks';
import s from './Main.module.scss';

function MainContent() {
  const [maxResults, setMaxResults] = useState(6);
  const chosenCategory = useAppSelector((state) => state.category);

  function chooseCategory() {
    setMaxResults(6);
  }

  return (
    <div className={s.root}>
      <div className={s.filterSection}>
        <Sidebar chooseCategory={chooseCategory} />
      </div>
      <Books
        category={chosenCategory.title || 'Architecture'}
        maxResults={maxResults}
        setMaxResults={setMaxResults}
      />
    </div>
  );
}

export default MainContent;
