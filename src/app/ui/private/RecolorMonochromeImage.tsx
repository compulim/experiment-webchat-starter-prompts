import './RecolorMonochromeImage.css';

import classNames from 'classnames';
import { memo, useMemo } from 'react';

type Props = { className?: string | undefined; src: string };

export default memo(function RecolorMonochromeImage({ className, src }: Props) {
  const style = useMemo(() => ({ maskImage: `url(${src})` }), [src]);

  return <div className={classNames(className, 'recolor-monochrome-image')} style={style} />;
});
