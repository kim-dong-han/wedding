package com.wedding.backend.admin;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.wedding.backend.service.WeddingInfoService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class AdminWeddingInfoController {

    private final WeddingInfoService weddingInfoService;

    @GetMapping("/admin/basic")
    public String basicForm(Model model) {
        model.addAttribute("info", weddingInfoService.get());
        return "admin/basic";
    }

    @PostMapping("/admin/basic")
    public String updateBasic(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime time,
        @RequestParam String message,
        @RequestParam String locationName,
        @RequestParam String locationHall,
        @RequestParam String locationAddress,
        @RequestParam double lat,
        @RequestParam double lng,
        @RequestParam String locationPhone,
        @RequestParam String groomName,
        @RequestParam String groomParentRelation,
        @RequestParam String groomFather,
        @RequestParam String groomMother,
        @RequestParam String brideName,
        @RequestParam String brideParentRelation,
        @RequestParam String brideFather,
        @RequestParam String brideMother
    ) {
        weddingInfoService.updateBasicAndLocation(
            date, time, message,
            locationName, locationHall, locationAddress, lat, lng, locationPhone,
            groomName, groomParentRelation, groomFather, groomMother,
            brideName, brideParentRelation, brideFather, brideMother
        );
        return "redirect:/admin/basic";
    }

    @GetMapping("/admin/account")
    public String accountForm(Model model) {
        model.addAttribute("info", weddingInfoService.get());
        return "admin/account";
    }

    @PostMapping("/admin/account")
    public String updateAccount(
        @RequestParam String groomBank,
        @RequestParam String groomAccountNumber,
        @RequestParam String groomOwner,
        @RequestParam String brideBank,
        @RequestParam String brideAccountNumber,
        @RequestParam String brideOwner
    ) {
        weddingInfoService.updateAccounts(groomBank, groomAccountNumber, groomOwner, brideBank, brideAccountNumber, brideOwner);
        return "redirect:/admin/account";
    }

    @GetMapping("/admin/gallery")
    public String galleryPage(Model model) {
        model.addAttribute("info", weddingInfoService.get());
        return "admin/gallery";
    }

    @PostMapping("/admin/gallery/add")
    public String addGalleryImage(@RequestParam String url) {
        if (url != null && !url.isBlank()) {
            weddingInfoService.addGalleryImage(url.trim());
        }
        return "redirect:/admin/gallery";
    }

    @PostMapping("/admin/gallery/remove")
    public String removeGalleryImage(@RequestParam int index) {
        weddingInfoService.removeGalleryImage(index);
        return "redirect:/admin/gallery";
    }

    @PostMapping("/admin/gallery/move")
    public String moveGalleryImage(@RequestParam int index, @RequestParam int direction) {
        weddingInfoService.moveGalleryImage(index, direction);
        return "redirect:/admin/gallery";
    }

    @GetMapping("/admin/interview")
    public String interviewPage(Model model) {
        model.addAttribute("info", weddingInfoService.get());
        return "admin/interview";
    }

    @PostMapping("/admin/interview/add")
    public String addInterview() {
        weddingInfoService.addInterview();
        return "redirect:/admin/interview";
    }

    @PostMapping("/admin/interview/update")
    public String updateInterview(@RequestParam int index, @RequestParam String question, @RequestParam String answer) {
        weddingInfoService.updateInterview(index, question, answer);
        return "redirect:/admin/interview";
    }

    @PostMapping("/admin/interview/remove")
    public String removeInterview(@RequestParam int index) {
        weddingInfoService.removeInterview(index);
        return "redirect:/admin/interview";
    }

    @GetMapping("/admin/notices")
    public String noticesPage(Model model) {
        model.addAttribute("info", weddingInfoService.get());
        return "admin/notices";
    }

    @PostMapping("/admin/notices/add")
    public String addNotice() {
        weddingInfoService.addNotice();
        return "redirect:/admin/notices";
    }

    @PostMapping("/admin/notices/update")
    public String updateNotice(@RequestParam int index, @RequestParam String title, @RequestParam String content) {
        weddingInfoService.updateNotice(index, title, content);
        return "redirect:/admin/notices";
    }

    @PostMapping("/admin/notices/remove")
    public String removeNotice(@RequestParam int index) {
        weddingInfoService.removeNotice(index);
        return "redirect:/admin/notices";
    }

    @GetMapping("/admin/transport")
    public String transportPage(Model model) {
        model.addAttribute("info", weddingInfoService.get());
        return "admin/transport";
    }

    @PostMapping("/admin/transport/add")
    public String addTransport() {
        weddingInfoService.addTransport();
        return "redirect:/admin/transport";
    }

    @PostMapping("/admin/transport/update")
    public String updateTransport(@RequestParam int index, @RequestParam String method, @RequestParam String description) {
        weddingInfoService.updateTransport(index, method, description);
        return "redirect:/admin/transport";
    }

    @PostMapping("/admin/transport/remove")
    public String removeTransport(@RequestParam int index) {
        weddingInfoService.removeTransport(index);
        return "redirect:/admin/transport";
    }

    @GetMapping("/admin/animation")
    public String animationForm(Model model) {
        model.addAttribute("info", weddingInfoService.get());
        return "admin/animation";
    }

    @PostMapping("/admin/animation")
    public String updateAnimation(
        @RequestParam(defaultValue = "false") boolean enabled,
        @RequestParam String text,
        @RequestParam String subtext
    ) {
        weddingInfoService.updateAnimation(enabled, text, subtext);
        return "redirect:/admin/animation";
    }

    @GetMapping("/admin/bgm")
    public String bgmForm(Model model) {
        model.addAttribute("info", weddingInfoService.get());
        return "admin/bgm";
    }

    @PostMapping("/admin/bgm")
    public String updateBgm(
        @RequestParam(defaultValue = "false") boolean enabled,
        @RequestParam String url,
        @RequestParam String title
    ) {
        weddingInfoService.updateBgm(enabled, url, title);
        return "redirect:/admin/bgm";
    }
}
