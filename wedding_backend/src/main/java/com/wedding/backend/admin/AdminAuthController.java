package com.wedding.backend.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
public class AdminAuthController {

    @Value("${app.admin.password}")
    private String adminPassword;

    @GetMapping("/admin/login")
    public String loginForm() {
        return "admin/login";
    }

    @PostMapping("/admin/login")
    public String login(@RequestParam String password, HttpServletRequest request, Model model) {
        if (adminPassword.equals(password)) {
            request.getSession(true).setAttribute(AdminAuthInterceptor.SESSION_KEY, true);
            return "redirect:/admin";
        }
        model.addAttribute("error", "비밀번호가 올바르지 않습니다.");
        return "admin/login";
    }

    @PostMapping("/admin/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/admin/login";
    }
}
