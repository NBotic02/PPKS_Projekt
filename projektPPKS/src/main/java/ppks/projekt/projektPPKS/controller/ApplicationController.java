package ppks.projekt.projektPPKS.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import ppks.projekt.projektPPKS.config.JwtService;
import ppks.projekt.projektPPKS.model.User;
import ppks.projekt.projektPPKS.repository.UsersRepo;

import java.util.Optional;

@Controller
public abstract class ApplicationController {
    User currentUser = null;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsersRepo korisnikRepo;

    @ModelAttribute("currentUser")
    public User getCurrentUser(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer")){
            String token = authorizationHeader.substring(7);

            try {
                String username = jwtService.extractUsername(token);
                Optional<User> korisnikOpt = korisnikRepo.findByUsername(username);
                User korisnik = null;
                if(korisnikOpt.isPresent()){
                    korisnik = korisnikOpt.get();
                    this.currentUser = korisnik;
                }
                return korisnik;
            }catch (Exception e){
                return null;
            }
        }

        return null;
    }
}
