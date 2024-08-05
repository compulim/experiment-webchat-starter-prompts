import './RecolorMonochromeImage.css';

import classNames from 'classnames';
import { memo, useMemo } from 'react';

type Props = { className?: string | undefined; fill?: string | undefined; src: string };

export default memo(function RecolorMonochromeImage({ className, fill, src }: Props) {
  const style = useMemo(() => ({ backgroundColor: fill, maskImage: `url(${src})` }), [fill, src]);

  return <div className={classNames(className, 'recolor-monochrome-image')} style={style} />;
});
