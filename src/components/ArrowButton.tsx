import styled from 'styled-components';
import { colors, transitionDuration } from '../utils';

export interface ArrowButtonProps {
  onClick(): void;
}

const ArrowButtonWrapper = styled.button`
  padding: 5px 10px;
  color: ${colors.main};

  ::after {
    content: '🡆';
  }

  transition: transform ${transitionDuration} ease;
  :hover, :focus-visible {
    transform: rotate(-180deg);
  }
`;

export const ArrowButton: React.FC<ArrowButtonProps> = ({ onClick }) => (
  <ArrowButtonWrapper {...{ onClick }} />
);
