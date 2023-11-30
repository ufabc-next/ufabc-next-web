import { TableComponent } from '.';
import { render, screen } from '@/test-utils';

describe('<TableComponent />', () => {
  it('render a table with head and body', () => {
    render(TableComponent, {
      slots: {
        head: 'head',
        body: 'body',
      },
    });
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
    expect(screen.getByText(/head/i)).toBeInTheDocument();
  });
});
