import {useAppDispatch, useAppSelector} from '@/pages/hooks';
import {removeCartItem} from '@/reducer';
import {BookDetailsProps} from '@/types';

export default function useRemoveFromCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  return function removeFromCart(details: BookDetailsProps) {
    const itemToRemove = cart.filter((item) => item.id === String(details.id));

    dispatch(removeCartItem(itemToRemove[itemToRemove.length - 1]));
  };
}
