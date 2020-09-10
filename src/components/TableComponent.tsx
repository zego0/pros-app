import React from 'react';
import { Table, Rating } from 'semantic-ui-react'

interface Props {
  pros: { id: number, name: string, postcode: string, rating: number }[]
  hiddenTable: boolean
}

const TableComponent: React.FC<Props> = (Props) => {

  const proRows = Props.pros.map(({ id, name, postcode, rating }) => {
    return <Table.Row key={id}>
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{postcode}</Table.Cell>
      <Table.Cell>
        <Rating huge="true" disabled icon='star' defaultRating={rating} maxRating={5} /> {rating.toFixed(1)}
      </Table.Cell>
    </Table.Row>;
  });
  return (
    <div hidden={Props.hiddenTable}>
      <Table color='green' key='green'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Postcode</Table.HeaderCell>
            <Table.HeaderCell>Review Rating</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {proRows}
        </Table.Body>
      </Table>

    </div>
  );
};

export default TableComponent;
