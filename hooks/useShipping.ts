import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTypedSelector } from '.';

export const useShipping = () => {
  const { shippingDetails } = useTypedSelector(state => state.cart.data);
  const router = useRouter();

  useEffect(() => {
    if (
      shippingDetails.address.trim().length === 0 ||
      shippingDetails.country.trim().length === 0 ||
      shippingDetails.city.trim().length === 0 ||
      shippingDetails.postalCode.trim().length === 0
    ) {
      router.push('/shipping');
    }
  }, [router, shippingDetails]);

  return shippingDetails;
};
