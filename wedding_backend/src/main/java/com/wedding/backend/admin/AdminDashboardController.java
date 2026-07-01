package com.wedding.backend.admin;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.wedding.backend.domain.GuestbookEntry;
import com.wedding.backend.domain.RsvpEntry;
import com.wedding.backend.service.GuestbookService;
import com.wedding.backend.service.RsvpService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class AdminDashboardController {

    private final RsvpService rsvpService;
    private final GuestbookService guestbookService;

    @GetMapping("/admin")
    public String dashboard(Model model) {
        var rsvps = rsvpService.findAll();
        var guestbook = guestbookService.findAll();

        int attendingCount = rsvps.stream().filter(RsvpEntry::isAttending).mapToInt(RsvpEntry::getGuests).sum();
        int notAttendingCount = rsvps.stream().filter(r -> !r.isAttending()).mapToInt(RsvpEntry::getGuests).sum();
        int groomCount = rsvps.stream().filter(r -> r.isAttending() && "groom".equals(r.getSide())).mapToInt(RsvpEntry::getGuests).sum();
        int brideCount = rsvps.stream().filter(r -> r.isAttending() && "bride".equals(r.getSide())).mapToInt(RsvpEntry::getGuests).sum();
        int totalInvited = rsvps.size();
        int responded = (int) rsvps.stream().count();
        int responseRate = totalInvited > 0 ? Math.round(100f * responded / totalInvited) : 0;

        model.addAttribute("attendingCount", attendingCount);
        model.addAttribute("notAttendingCount", notAttendingCount);
        model.addAttribute("groomCount", groomCount);
        model.addAttribute("brideCount", brideCount);
        model.addAttribute("totalInvited", totalInvited);
        model.addAttribute("responseRate", responseRate);
        model.addAttribute("guestbookCount", guestbook.size());
        return "admin/dashboard";
    }
}
