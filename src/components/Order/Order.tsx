import { FC, useEffect, useState } from 'react';
import Price from '../Price/Price';
import { FormattedDate } from '@ya.praktikum/react-developer-burger-ui-components';
import { findIngredientObj, translateOrderStatus } from '../../utils/utils';
import { useSelector } from '../../services/hooks';
import { getIngredients, getLoadingStatus } from '../../services/selectors/ingredientsSelector';
import { TIngredientExtraId } from '../../utils/types';
import styles from './Order.module.css';
import { Link, useLocation } from 'react-router-dom';
import { StatusKind } from '../../utils/api/types';

type TOrderProps = {
  ingredients: string[];
  _id: string;
  number: number;
  createdAt: string;
  name: string;
  status: StatusKind;
  usageCase: 'feed' | 'profile/orders';
};



const Order: FC<TOrderProps> = ({ ingredients, _id, number, createdAt, name, status, usageCase }) => {
  const location = useLocation();

  const ingredientsFromServer = useSelector(getIngredients);
  const isLoading = useSelector(getLoadingStatus);

  // переназову переменную с массивом айдишек ингредиентов из заказа
  const idArr = ingredients;

  // стейт объектов ингредиентов
  const [ingredientsArr, setIngredientsArr] = useState<(TIngredientExtraId | null)[]>([]);
  const [isNull, setIsNull] = useState(false);



  useEffect(() => {
    if (isLoading === false && ingredientsFromServer.length) {
      // создаем массив ингредиентов из айдишек
      const ingredientsArrNew = idArr.map(id => findIngredientObj(id, ingredientsFromServer));
      // когда массив объектов полностью создан, проверяем его членов на нулёвость
      if (ingredientsArrNew.some(el => el === null)) {
        setIsNull(true);
      } else {
        // и только послё всего этого меняем стейт (минимизируем ререндеры)
        setIngredientsArr(ingredientsArrNew);
        setIsNull(false);
      }
    };
  }, [ingredientsFromServer, isLoading]);

  const statusRus = translateOrderStatus(status);

  const price = ingredientsArr.reduce((acc, el) => acc + el!.price, 0);

  return (
    <li className={`${styles.item} ${isNull ? styles.nullish : ''} `}>
      <Link
        to={isNull ? 'https://yandex.ru/support/market/return/terms.html#return__money'
          : `${number}`}
        state = {{
          background: location,
          data: {
            number,
            name,
            statusRus,
            idArr,
            time: createdAt,
            price
          }
        }}
        className={`linkGlobal ${styles.link}`}
        target={!isNull ? '' : '_blank'}
        rel={!isNull ? '' : "noopener noreferrer"}
      >

        {isNull && (
          <>
            <div className={styles.hat}>
              <span className='text text_type_digits-default'>#{number}</span>
              <FormattedDate date={new Date(createdAt)} className='text text_type_main-default text_color_inactive' />
            </div>
            <h4 className={`text text_type_main-default ${styles.errorHeading}`}>
              {`Ошибка получения заказа!
            Пожалуйста, перезагрузите страницу👾`}
            </h4>
          </>
        )}


        {!isNull && (
          <>
            <div className={styles.hat}>
              <span className='text text_type_digits-default'>#{number}</span>
              <FormattedDate date={new Date(createdAt)} className='text text_type_main-default text_color_inactive' />
            </div>

            <div>
              <h4 className={`text text_type_main-medium ${usageCase === 'feed' ? 'mb-6' : 'mb-2'} mt-6`}>{name}</h4>
              {usageCase !== 'feed' && (
                <p className={`text text_type_main-default mb-6 ${status === StatusKind.DONE ? styles.success : ''}`}>
                  {statusRus}
                </p>
              )}
            </div>

            <div className={styles.footer}>
              <ul className={styles.imagesList + ` listGlobal`}>
                {ingredientsArr.map((el, i, arr) => {
                  if (i < 5) {
                    return (
                      // TODO: в глобальных стилях прописать
                      <li className={`little-item-${i} ${styles.circle}`} key={i}>
                        <img src={el?.image_mobile ? el.image_mobile : el!.image}
                          alt={el!.name}
                          className={styles.image}
                        ></img>
                      </li>
                    )
                  } else {
                    if (i === 5) return (
                      <li className={`little-item-${i} ${styles.circle}`} key={i}>
                        <img src={el?.image_mobile ? el.image_mobile : el!.image}
                          alt={el!.name}
                          className={styles.image}
                        />
                        {<span className={`text text_type_main-default ${arr.length - i === 1 ? '' : styles.counter}`}>+{arr.length - i}</span>}
                      </li>
                    );

                    return null; // для дальнейших ингредиентов выводим священное НИЧЕГО
                  }
                })}
              </ul>
              <Price value={price} digitsSize='default' />
            </div>
          </>
        )}
      </Link>
    </li>
  )
};

export default Order;
