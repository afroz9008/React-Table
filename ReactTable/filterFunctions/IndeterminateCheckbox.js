import React from 'react';
import { Checkbox } from '@mui/material';

export const IndeterminateCheckbox = React.forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);
    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} indeterminate={indeterminate} style={{ padding: 0 }} />
      </>
    );
  }
);
export default IndeterminateCheckbox;
