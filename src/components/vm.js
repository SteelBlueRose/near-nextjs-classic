import { useEffect, useContext } from 'react';
import { useInitNear, Widget } from 'near-social-vm';

import { NearContext } from '@/context';
import { NetworkId } from '@/config';

export default function Component({ src }) {
  const { wallet } = useContext(NearContext);
  const { initNear } = useInitNear();

  useEffect(() => {
    wallet && initNear && initNear({ networkId: NetworkId, selector: wallet.selector, config: { allowOtherContracts: true } });
  }, [wallet, initNear]);

  const href = wallet.networkId === 'mainnet' ?
    `https://near.social/mob.near/widget/WidgetSource?src=${src}` :
    `https://test.near.social/eugenethedream/widget/WidgetSource?src=${src}`;

  return (
    <div>
      <Widget src={src} />
      <p className="mt-4 small"> <span className="text-secondary">Source:</span> <a href={href}> {src} </a> </p>
    </div>
  );
}
