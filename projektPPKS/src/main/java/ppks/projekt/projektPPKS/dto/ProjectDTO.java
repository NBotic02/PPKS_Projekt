package ppks.projekt.projektPPKS.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class ProjectDTO {
    @NotBlank(message = "Please enter name of the project")
    private String name;

    private String description;
}
