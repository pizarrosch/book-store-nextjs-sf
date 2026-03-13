import {useState} from 'react';
import Books from '@/components/Book/Books';
import Sidebar from '@/components/Drawer/Sidebar';
import {useAppSelector} from '@/pages/hooks';
import s from './Main.module.scss';

function MainContent() {
  const [page, setPage] = useState(1);
  const chosenCategory = useAppSelector((state) => state.category);

  function chooseCategory() {
    setPage(1);
  }

  return (
    <div className={s.root}>
      <div className={s.filterSection}>
        <Sidebar chooseCategory={chooseCategory} />
      </div>
      <Books
        category={chosenCategory.title || 'Architecture'}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export default MainContent;
