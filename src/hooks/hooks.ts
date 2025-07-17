import {useAppDispatch, useAppSelector} from '@/pages/hooks';
import {removeCartItem, subtractPrice} from '@/reducer';
import {BookDetailsProps} from '@/types';

export default function useRemoveFromCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  return function removeFromCart(details: BookDetailsProps) {
    const itemToRemove = cart.filter((item) => item.id === String(details.id));
    const itemInTheCart = cart.find((item) => item.id === String(details.id));
    const quantity = itemInTheCart?.number || 0;

    dispatch(removeCartItem(itemToRemove[itemToRemove.length - 1]));
    dispatch(subtractPrice(details.saleInfo.listPrice.amount * quantity));
  };
}
