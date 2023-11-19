import Main from '../components/Main/Main';
import Modal from '../components/Modal/Modal';

import { useDispatch, useSelector } from 'react-redux';

import { getErrorStatus } from '../services/selectors/ingredientsSelector';
import { getOrderSuccess } from '../services/selectors/orderDetailsSelector';

function HomePage() {
  const isErrorOnIngredients = useSelector(getErrorStatus);
  const isOrderSucces = useSelector(getOrderSuccess);
  const dispatch = useDispatch();
  return (
    <>
      <Main />
      {/* Если модалку рисовать взамен всего приложения, то не выполнится его код по выводу ошибок? */}
      {isErrorOnIngredients || isOrderSucces === false ? (
        <Modal>
          <p className="text text_type_main-medium mt-30">
            Произошла ошибка, пожалуйста, перезагрузите страницу.
          </p>
        </Modal>
      ) : ('')
      }
    </>
  )
}

export default HomePage;
