package ppks.projekt.projektPPKS.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "project")
@AllArgsConstructor
@RequiredArgsConstructor
@ToString(exclude = {"tasks", "userProjects", "userInvitations", "createdBy"})
@EqualsAndHashCode(exclude = {"tasks", "userProjects", "userInvitations", "createdBy"})
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    private Long Id;

    @NotBlank(message = "Please enter name of the project")
    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "description")
    private String description;

    @CreationTimestamp
    @Column(name = "createdDate", nullable = false, updatable = false)
    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "userId")
    @JsonBackReference
    private User createdBy;

    @OneToMany(mappedBy = "project")
    @JsonManagedReference
    private List<Task> tasks;

    @OneToMany(mappedBy = "project")
    @JsonManagedReference
    private List<UserProject> userProjects;

    @OneToMany(mappedBy = "project")
    @JsonManagedReference
    private List<UserInvitation> userInvitations;
}

