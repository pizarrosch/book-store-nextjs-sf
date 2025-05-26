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
      <Sidebar chooseCategory={chooseCategory} />
      <div className={s.root}>
        <Books
          category={chosenCategory.title || 'Architecture'}
          maxResults={maxResults}
          setMaxResults={setMaxResults}
        />
      </div>
    </div>
  );
}

export default MainContent;
