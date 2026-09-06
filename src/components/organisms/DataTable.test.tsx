import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable, type Column } from './DataTable';

interface Row {
  id: string;
  name: string;
}

const columns: Column<Row>[] = [{ key: 'name', header: 'Name', render: (row) => row.name }];

describe('DataTable', () => {
  it('renders a row per item', () => {
    render(
      <DataTable
        columns={columns}
        rows={[{ id: '1', name: 'Ada' }]}
        rowKey={(row) => row.id}
        emptyLabel="none"
      />,
    );
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('shows the empty label when there are no rows', () => {
    render(
      <DataTable columns={columns} rows={[]} rowKey={(row) => row.id} emptyLabel="Nothing here" />,
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});
