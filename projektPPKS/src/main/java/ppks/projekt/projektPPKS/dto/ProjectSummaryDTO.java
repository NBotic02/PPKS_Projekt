package ppks.projekt.projektPPKS.dto;

import lombok.Data;

@Data
public class ProjectSummaryDTO {
    private Long id;
    private String name;
    private String description;
    private java.util.Date createdDate;
}
