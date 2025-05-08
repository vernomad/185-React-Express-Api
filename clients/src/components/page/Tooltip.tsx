import {
    Tooltip as ReactTooltip,
    type ITooltip as TooltipProps,
} from 'react-tooltip';


import { cn } from '../../lib/utils';

export function Tooltip(props: TooltipProps) {
    return (
        <ReactTooltip
            className={cn(
                'hidden',
                '',
                '',
                props.className,
            )}
            {...props}
        />
    );
}