package ppks.projekt.projektPPKS.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class NewPasswordRequestDTO {
    String oldPassword;
    String newPassword;
}