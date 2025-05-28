package ppks.projekt.projektPPKS.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ppks.projekt.projektPPKS.enums.UserEnum;

import java.time.LocalDate;
import java.time.Period;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "users")
@AllArgsConstructor
@RequiredArgsConstructor
@ToString(exclude = {"userProjects", "createdProjects", "createdTasks", "assignedTasks", "sentInvitations", "receivedInvitations"})
@EqualsAndHashCode(exclude = {"userProjects", "createdProjects", "createdTasks", "assignedTasks", "sentInvitations", "receivedInvitations"})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id", nullable = false)
    private Long Id;

    @NotBlank(message = "unesi ime pravilno")
    @Column(name = "name")
    private String name;

    @NotBlank(message = "unesi prezime pravilno")
    @Column(name = "surname")
    private String surname;

    @Email
    @NotNull
    @Column(name = "email", unique = true)
    private String email;

    @NotNull
    @Column(name = "password")
    private String password;

    @NotNull
    @Column(name = "username", unique = true)
    private String username;

    @NotNull
    @Column(name = "gender")
    private char gender;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @NotNull
    @Column(name = "userType")
    @Enumerated(EnumType.STRING)
    private UserEnum role;

    @CreationTimestamp
    @Column(name = "createdDate", nullable = false, updatable = false)
    private Date createdDate;

    @NotNull
    @Column(name = "token")
    private String token;

    @Transient
    public int getAge() {
        return Period.between(this.dateOfBirth, LocalDate.now()).getYears();
    }

    // RELATIONS

    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<UserProject> userProjects = new java.util.ArrayList<>();

    public List<UserProject> getUserProjects() {
        return userProjects != null ? userProjects : java.util.Collections.emptyList();
    }

    @OneToMany(mappedBy = "createdBy")
    @JsonManagedReference
    private List<Project> createdProjects = new java.util.ArrayList<>();

    public List<Project> getCreatedProjects() {
        return createdProjects != null ? createdProjects : java.util.Collections.emptyList();
    }

    @OneToMany(mappedBy = "createdBy")
    @JsonManagedReference
    private List<Task> createdTasks;

    @OneToMany(mappedBy = "assignedTo")
    @JsonManagedReference
    private List<Task> assignedTasks;

    @OneToMany(mappedBy = "createdBy")
    @JsonManagedReference
    private List<UserInvitation> sentInvitations;

    @OneToMany(mappedBy = "invitedUser")
    @JsonManagedReference
    private List<UserInvitation> receivedInvitations;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
