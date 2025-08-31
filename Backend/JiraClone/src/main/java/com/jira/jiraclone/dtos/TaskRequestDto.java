package com.jira.jiraclone.dtos;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequestDto {
    @NotBlank(message = "Le titre est obligatoire.")
    @Size(min = 3, max = 180)
    private String title;

    @Size(max = 2000)
    private String description;


    private Long sprintId;
}
