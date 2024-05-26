import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/api-client';
type BookType = {
    id: number,
    isbn: number,
    title: string,
    cover: string,
    author: string,
    published: number,
    pages: number
}
const Books = () => {
    const { data, error, isLoading } = useQuery<BookType[], Error>({
        queryKey: ['allBooks'], queryFn: () =>
            apiClient('GET', '/books')
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div>Books {data ? data?.length > 0 && data.map((book) => <div key={book.id}>{book.title}</div>) : "no data"}</div>
    )
}

export default Books