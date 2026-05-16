"use client";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;
const Th = styled.th`
  text-align: left;
  padding: 0.5rem;
  background: #f5f5f5;
`;
const Td = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
`;

export default function StockIndicators({
  indicators,
}: {
  indicators: { [key: string]: string | number };
}) {
  return (
    <Table>
      <tbody>
        {Object.entries(indicators).map(([key, value]) => (
          <tr key={key}>
            <Th>{key}</Th>
            <Td>{value}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
