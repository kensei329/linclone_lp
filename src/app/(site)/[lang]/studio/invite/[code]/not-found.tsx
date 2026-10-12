import { NotAvailable } from '@/components/clone-pages/NotAvailable.client';
import { stateVariants } from '@/components/clone-pages/states';

// DONE-C §2.3 step 2: the API does not know the code (unknown, malformed or
// revoked — one answer). HTTP 404.
export default function InviteNotValid() {
  const v = stateVariants('invite.invalidTitle', 'invite.invalidBody');
  return <NotAvailable ja={v.ja} en={v.en} />;
}
