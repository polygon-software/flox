/**
 * This type represents the tooltip data that is sent in a component prop.
 */
export type Tooltip = {
  anchor:
    | 'top left'
    | 'top middle'
    | 'top right'
    | 'top start'
    | 'top end'
    | 'center left'
    | 'center middle'
    | 'center right'
    | 'center start'
    | 'center end'
    | 'bottom left'
    | 'bottom middle'
    | 'bottom right'
    | 'bottom start'
    | 'bottom end'
    | undefined;
  self:
    | 'top left'
    | 'top middle'
    | 'top right'
    | 'top start'
    | 'top end'
    | 'center left'
    | 'center middle'
    | 'center right'
    | 'center start'
    | 'center end'
    | 'bottom left'
    | 'bottom middle'
    | 'bottom right'
    | 'bottom start'
    | 'bottom end'
    | undefined;
  text: string;
};
