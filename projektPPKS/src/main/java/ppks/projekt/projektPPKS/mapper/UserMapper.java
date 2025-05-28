package ppks.projekt.projektPPKS.mapper;

import ppks.projekt.projektPPKS.dto.ProjectDTOResponse;
import ppks.projekt.projektPPKS.dto.ProjectSummaryDTO;
import ppks.projekt.projektPPKS.dto.UserResponseDTO;
import ppks.projekt.projektPPKS.dto.UserSummaryDTO;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.model.UserProject;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {
    public static UserResponseDTO toDTO(User user) {
        List<ProjectDTOResponse> createdProjects = user.getCreatedProjects()
                .stream()
                .map(ProjectMapper::toDto)
                .collect(Collectors.toList());

        List<ProjectDTOResponse> joinedProjects = user.getUserProjects()
                .stream()
                .map(UserProject::getProject)
                .map(ProjectMapper::toDto)
                .collect(Collectors.toList());

        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .username(user.getUsername())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole())
                .createdProjects(createdProjects)
                .joinedProjects(joinedProjects)
                .build();
    }

    public static UserSummaryDTO toUserSummaryDTO(User user) {
        if (user == null) return null;
        UserSummaryDTO dto = new UserSummaryDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setSurname(user.getSurname());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
