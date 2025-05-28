package ppks.projekt.projektPPKS.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ppks.projekt.projektPPKS.dto.UserInvitationDTO;
import ppks.projekt.projektPPKS.enums.UserInvitationEnum;
import ppks.projekt.projektPPKS.mapper.UserInvitationMapper;
import ppks.projekt.projektPPKS.model.Project;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.model.UserInvitation;
import ppks.projekt.projektPPKS.model.UserProject;
import ppks.projekt.projektPPKS.repository.ProjectRepo;
import ppks.projekt.projektPPKS.repository.UserInvitationRepo;
import ppks.projekt.projektPPKS.repository.UserProjectRepo;
import ppks.projekt.projektPPKS.repository.UsersRepo;
import ppks.projekt.projektPPKS.service.UserInvitationService;
import ppks.projekt.projektPPKS.dto.UserInvitationResponseDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserInvitationServiceImpl implements UserInvitationService {

    private final UserInvitationRepo invitationRepository;
    private final UsersRepo userRepository;
    private final ProjectRepo projectRepository;
    private final UserInvitationRepo userInvitationRepository;
    private final UserProjectRepo userProjectRepository;

    @Override
    public void sendInvitation(UserInvitationDTO userInvitationDTO, User currentUser) {
        Project project = projectRepository.findById(userInvitationDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User invitedUser = userRepository.findById(userInvitationDTO.getInvitedUser())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserInvitation userInvitation = new UserInvitation();
        userInvitation.setTitle(userInvitationDTO.getTitle());
        userInvitation.setDescription(userInvitationDTO.getDescription());
        userInvitation.setCreatedBy(currentUser);
        userInvitation.setStatus(UserInvitationEnum.PENDING);
        userInvitation.setProject(project);

        userInvitation.setInvitedUser(invitedUser);

        userInvitationRepository.save(userInvitation);
    }

    @Override
    public void acceptInvitation(Long invitationId) {
        UserInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        invitation.setStatus(UserInvitationEnum.ACCEPTED);
        invitationRepository.save(invitation);

        UserProject userProject = new UserProject();
        userProject.setUser(invitation.getInvitedUser());
        userProject.setProject(invitation.getProject());

        userProjectRepository.save(userProject);
    }


    @Override
    public void rejectInvitation(Long invitationId) {
        UserInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new IllegalArgumentException("Invitation not found"));

        invitation.setStatus(UserInvitationEnum.REJECTED);
        invitationRepository.save(invitation);
    }

    @Override
    public List<UserInvitationResponseDTO> getInvitationsForUser(Long userId) {
        List<UserInvitation> invitations = invitationRepository.findByInvitedUserId(userId);
        return invitations.stream()
                .map(UserInvitationMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}
