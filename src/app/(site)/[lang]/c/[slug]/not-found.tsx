import { NotAvailable } from '@/components/clone-pages/NotAvailable.client';
import { stateVariants } from '@/components/clone-pages/states';

// DONE-C §2.1 step 2: the neutral "not available" page (HTTP 404). One page
// for every reason the API does not serve a clone, and for "throttled with
// nothing cached": it never says why.
export default function CloneNotAvailable() {
  const v = stateVariants('shared.notAvailableTitle', 'shared.notAvailableBody');
  return <NotAvailable ja={v.ja} en={v.en} />;
}
