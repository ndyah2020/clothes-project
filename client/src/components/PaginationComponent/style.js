import styled from 'styled-components';
export const PaginationContainer = styled.div`
    .pagination {
        display: flex;
        justify-content: center;
        list-style: none;
        padding: 0;
        margin: 20px 0;
    }

    .pagination li {
        margin: 0 5px;
    }

    .pagination li a {
        padding: 10px 15px;
        border: 1px solid #ddd;
        color: #333;
        cursor: pointer;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    .pagination li a:hover {
        background-color: #777777;
        color: white;
    }

    .pagination li.active a {
        background-color: #777777;
        color: white;
        border: none;
    }

    .pagination li.disabled a {
        color: #ccc;
        cursor: not-allowed;
    }

    .pagination li.break a {
        cursor: default;
    }
`;
