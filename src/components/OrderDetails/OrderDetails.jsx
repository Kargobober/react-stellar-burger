import styles from './OrderDetails.module.css';
import orderAcceptedSvg from '../../images/order-accepted.svg';
import { useSelector } from 'react-redux';
import { getOrderIsLoading, getOrderNumber, getOrderSuccess } from '../../services/selectors/orderDetailsSelector';

function OrderDetails() {
  const orderNumber = useSelector(getOrderNumber);
  const isLoading = useSelector(getOrderIsLoading);
  const success = useSelector(getOrderSuccess);


  return (
    <div className={`${styles.container}`}>
      <h3 className={`text text_type_digits-large ${styles.heading}`}>{orderNumber ? orderNumber : ' . . . . . '}</h3>
      <p className='text text_type_main-medium mt-8'>идентификатор заказа</p>
      {!isLoading && success ? (
        <img src={orderAcceptedSvg} alt="Статус заказа" className='mt-15 mb-15'/>
      ) : (
        <div className={styles.bigStub}/>
      )}
      <p className='text text_type_main-default'>
        {!isLoading && success ? 'Ваш заказ начали готовить' : 'Создаём заказ...'}
      </p>
      {!isLoading && success ? (
        <p className='text text_type_main-default text_color_inactive mt-2'>
          Дождитесь готовности на орбитальной станции
        </p>
      ) : (
        <div className={styles.stub}/>
      )}
    </div>
  )
}

export default OrderDetails;