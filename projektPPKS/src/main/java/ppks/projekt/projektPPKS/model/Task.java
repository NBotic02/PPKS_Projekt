package ppks.projekt.projektPPKS.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import ppks.projekt.projektPPKS.enums.TaskEnum;

import java.util.Date;

@Data
@Entity
@Table(name = "task")
@AllArgsConstructor
@RequiredArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    private Long Id;

    @NotBlank(message = "Please enter title")
    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "status")
    private TaskEnum status;

    @CreationTimestamp
    @Column(name = "createdDate", nullable = false, updatable = false)
    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "createdByUserId")
    @JsonBackReference
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "assignedToId")
    @JsonBackReference
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "projectId")
    @JsonBackReference
    private Project project;
}