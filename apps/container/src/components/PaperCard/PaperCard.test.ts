import { PaperCard } from '.';
import { render, screen } from '@/test-utils';

describe('<PaperCard />', () => {
  it('render a paper card title', () => {
    render(PaperCard, { props: { title: 'title' } });
    expect(screen.getByText(/title/i)).toBeInTheDocument();
  });
  it('render a paper card slot', () => {
    render(PaperCard, { slots: { default: 'slot' } });
    expect(screen.getByText(/slot/i)).toBeInTheDocument();
  });
});
