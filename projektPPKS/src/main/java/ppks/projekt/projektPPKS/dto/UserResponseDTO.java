package ppks.projekt.projektPPKS.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import ppks.projekt.projektPPKS.enums.UserEnum;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class UserResponseDTO {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String username;
    private char gender;
    private LocalDate dateOfBirth;
    private UserEnum role;

    private List<ProjectDTOResponse> createdProjects;
    private List<ProjectDTOResponse> joinedProjects;
}
