package com.booksen.api.books;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "books")
public class Books {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name;
    private String description;
    private String cover;
    private String author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}

