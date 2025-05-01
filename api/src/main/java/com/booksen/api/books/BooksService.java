package com.booksen.api.books;

import com.booksen.api.dto.books.BookFilter;
import com.booksen.api.dto.books.BookResponseDTO;
import com.booksen.api.dto.books.CreateUpdateBookDTO;
import com.booksen.api.helpers.BooksHelper;
import com.booksen.api.model.BaseService;
import com.booksen.api.model.Response;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BooksService extends BaseService<Books, String, CreateUpdateBookDTO, BookResponseDTO> {
    private final BooksRepository booksRepository;
    private final BooksHelper booksHelper;

    public BooksService(BooksRepository booksRepository, Validator validator, BooksHelper booksHelper) {
        super(booksRepository, validator, booksHelper, "Books");
        this.booksRepository = booksRepository;
        this.booksHelper = booksHelper;
    }

    public Response<List<BookResponseDTO>> getByCategories(List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return Response.badRequest("Category list cannot be empty");
        }

        List<Books> books = booksRepository.findByCategory_NameIn(categories);

        if (books.isEmpty()) {
            return Response.notFound("No books found for the given categories");
        }

        return Response.ok(
                books.stream()
                        .map(booksHelper::toResponseEntity)
                        .collect(Collectors.toList()),
                "Books retrieved successfully"
        );
    }

    public Response<List<BookResponseDTO>> getByAuthors(List<String> authors) {
        if (authors == null || authors.isEmpty()) {
            return Response.badRequest("Author list cannot be empty");
        }

        List<Books> books = booksRepository.findByAuthorIn(authors);

        return books.isEmpty() ?
                Response.notFound("No books found for the given authors") :
                Response.ok(
                        books.stream()
                                .map(booksHelper::toResponseEntity)
                                .collect(Collectors.toList()),
                        "Books retrieved successfully"
                );
    }

    public Response<List<BookResponseDTO>> searchBooks(BookFilter filter) {
        LocalDateTime minDate = filter.getCreatedAfter() != null ?
                filter.getCreatedAfter().atStartOfDay() : null;
        LocalDateTime maxDate = filter.getCreatedBefore() != null ?
                filter.getCreatedBefore().atTime(LocalTime.MAX) : null;

        List<Books> books = booksRepository.findByFilters(
                filter.getCategories(),
                filter.getAuthors(),
                minDate,
                maxDate
        );

        return books.isEmpty() ?
                Response.notFound("No books match the search criteria") :
                Response.ok(
                        books.stream()
                                .map(booksHelper::toResponseEntity)
                                .collect(Collectors.toList()),
                        "Books retrieved successfully"
                );
    }
}
