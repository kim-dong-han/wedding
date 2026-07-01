package com.wedding.backend.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.wedding.backend.service.GuestbookService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class AdminGuestbookController {

    private final GuestbookService guestbookService;

    @GetMapping("/admin/guestbook")
    public String guestbookPage(Model model) {
        model.addAttribute("entries", guestbookService.findAll());
        return "admin/guestbook";
    }

    @PostMapping("/admin/guestbook/{id}/delete")
    public String deleteEntry(@PathVariable String id) {
        guestbookService.deleteAsAdmin(id);
        return "redirect:/admin/guestbook";
    }
}
