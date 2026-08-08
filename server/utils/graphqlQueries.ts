export const GET_BOARD_ITEMS_QUERY = `
  query GetBoardItems($boardIds: [ID!]!) {
    boards(ids: $boardIds) {
      id
      name
      description
      columns {
        id
        title
        type
      }
      items_page(limit: 500) {
        cursor
        items {
          id
          name
          updated_at
          column_values {
            id
            text
            value
            type
          }
        }
      }
    }
  }
`;
