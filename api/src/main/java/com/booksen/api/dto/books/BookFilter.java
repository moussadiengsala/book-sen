package com.booksen.api.dto.books;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookFilter {
    private List<String> categories;
    private List<String> authors;
    private LocalDate createdAfter;
    private LocalDate createdBefore;
}