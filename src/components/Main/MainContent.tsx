import {useState} from 'react';
import Books from '@/components/Book/Books';
import CategoryDropdown from '@/components/CategoryDropdown/CategoryDropdown';
import Pagination from '@/components/Pagination/Pagination';
import {useAppSelector} from '@/pages/hooks';
import s from './Main.module.scss';

function MainContent() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const chosenCategory = useAppSelector((state) => state.category);

  function chooseCategory() {
    setPage(1);
  }

  return (
    <div className={s.root}>
      <div className={s.filterSection}>
        <CategoryDropdown chooseCategory={chooseCategory} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
      <Books
        category={chosenCategory.title || 'Architecture'}
        page={page}
        setPage={setPage}
        setTotalPages={setTotalPages}
      />
    </div>
  );
}

export default MainContent;
