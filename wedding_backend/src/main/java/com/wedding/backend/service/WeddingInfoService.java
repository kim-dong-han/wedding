package com.wedding.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.wedding.backend.domain.InterviewItem;
import com.wedding.backend.domain.NoticeItem;
import com.wedding.backend.domain.TransportItem;
import com.wedding.backend.domain.WeddingInfo;
import com.wedding.backend.dto.WeddingInfoDto;
import com.wedding.backend.repository.WeddingInfoRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class WeddingInfoService {

    private final WeddingInfoRepository weddingInfoRepository;

    public WeddingInfo get() {
        return weddingInfoRepository.findById(WeddingInfo.SINGLETON_ID)
            .orElseGet(this::seedDefault);
    }

    public WeddingInfoDto getDto() {
        return toDto(get());
    }

    private WeddingInfo seedDefault() {
        WeddingInfo info = new WeddingInfo();
        info.setId(WeddingInfo.SINGLETON_ID);

        info.getGroom().setName("김철수");
        info.getGroom().setParentRelation("장남");
        info.getGroom().setFather("김영호");
        info.getGroom().setMother("박순자");
        info.getGroom().setAccountBank("신한은행");
        info.getGroom().setAccountNumber("110-xxx-xxxxxx");
        info.getGroom().setAccountOwner("김철수");

        info.getBride().setName("이영희");
        info.getBride().setParentRelation("장녀");
        info.getBride().setFather("이정식");
        info.getBride().setMother("최미경");
        info.getBride().setAccountBank("국민은행");
        info.getBride().setAccountNumber("00000-xx-xxxxxx");
        info.getBride().setAccountOwner("이영희");

        info.setDate(LocalDate.of(2024, 10, 26));
        info.setTime(LocalTime.of(13, 0));

        info.getLocation().setName("더 리버사이드 호텔");
        info.getLocation().setHall("7층 콘서트홀");
        info.getLocation().setAddress("서울특별시 서초구 강남대로107길 6");
        info.getLocation().setLat(37.5165);
        info.getLocation().setLng(127.0195);
        info.getLocation().setPhone("02-6710-1100");

        info.setMessage("저희 두 사람이 사랑으로 만나 진실한 가정을 이루고자 합니다.\n귀한 걸음 하시어 저희의 시작을 축복해 주시면 큰 기쁨이겠습니다.");

        info.getGallery().addAll(List.of(
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
        ));

        info.getInterview().add(new InterviewItem("첫 만남은 어떻게 되셨나요?", "지인의 소개로 만나게 되었습니다."));
        info.getInterview().add(new InterviewItem("프로포즈는 어떻게 하셨나요?", "조용한 레스토랑에서 준비했습니다."));

        info.getNotices().add(new NoticeItem("주차 안내", "예식장 내 주차장이 협소하오니 대중교통 이용 부탁드립니다."));

        info.getTransportation().add(new TransportItem("지하철", "2호선 강남역 3번 출구에서 도보 5분"));
        info.getTransportation().add(new TransportItem("버스", "간선 140, 142번 강남역 하차"));

        info.getOpeningAnimation().setEnabled(true);
        info.getOpeningAnimation().setText("저희 두 사람, 결혼합니다");
        info.getOpeningAnimation().setSubtext("W E   G E T   M A R R I E D");

        info.getBgm().setEnabled(false);
        info.getBgm().setUrl("");
        info.getBgm().setTitle("");

        return weddingInfoRepository.save(info);
    }

    public WeddingInfoDto toDto(WeddingInfo info) {
        return new WeddingInfoDto(
            new WeddingInfoDto.PersonDto(
                info.getGroom().getName(),
                info.getGroom().getParentRelation(),
                new WeddingInfoDto.ParentsDto(info.getGroom().getFather(), info.getGroom().getMother()),
                new WeddingInfoDto.AccountDto(info.getGroom().getAccountBank(), info.getGroom().getAccountNumber(), info.getGroom().getAccountOwner())
            ),
            new WeddingInfoDto.PersonDto(
                info.getBride().getName(),
                info.getBride().getParentRelation(),
                new WeddingInfoDto.ParentsDto(info.getBride().getFather(), info.getBride().getMother()),
                new WeddingInfoDto.AccountDto(info.getBride().getAccountBank(), info.getBride().getAccountNumber(), info.getBride().getAccountOwner())
            ),
            info.getDate() == null ? null : info.getDate().toString(),
            info.getTime() == null ? null : info.getTime().toString(),
            new WeddingInfoDto.LocationDto(
                info.getLocation().getName(), info.getLocation().getHall(), info.getLocation().getAddress(),
                info.getLocation().getLat(), info.getLocation().getLng(), info.getLocation().getPhone()
            ),
            info.getMessage(),
            info.getGallery(),
            info.getInterview().stream().map(i -> new WeddingInfoDto.InterviewDto(i.getQuestion(), i.getAnswer())).toList(),
            info.getNotices().stream().map(n -> new WeddingInfoDto.NoticeDto(n.getTitle(), n.getContent())).toList(),
            info.getTransportation().stream().map(t -> new WeddingInfoDto.TransportDto(t.getMethod(), t.getDescription())).toList(),
            new WeddingInfoDto.OpeningAnimationDto(info.getOpeningAnimation().isEnabled(), info.getOpeningAnimation().getText(), info.getOpeningAnimation().getSubtext()),
            new WeddingInfoDto.BgmDto(info.getBgm().isEnabled(), info.getBgm().getUrl(), info.getBgm().getTitle())
        );
    }

    public void updateBasicAndLocation(
        LocalDate date, LocalTime time, String message,
        String locationName, String locationHall, String locationAddress, double lat, double lng, String locationPhone,
        String groomName, String groomParentRelation, String groomFather, String groomMother,
        String brideName, String brideParentRelation, String brideFather, String brideMother
    ) {
        WeddingInfo info = get();
        info.setDate(date);
        info.setTime(time);
        info.setMessage(message);
        info.getLocation().setName(locationName);
        info.getLocation().setHall(locationHall);
        info.getLocation().setAddress(locationAddress);
        info.getLocation().setLat(lat);
        info.getLocation().setLng(lng);
        info.getLocation().setPhone(locationPhone);
        info.getGroom().setName(groomName);
        info.getGroom().setParentRelation(groomParentRelation);
        info.getGroom().setFather(groomFather);
        info.getGroom().setMother(groomMother);
        info.getBride().setName(brideName);
        info.getBride().setParentRelation(brideParentRelation);
        info.getBride().setFather(brideFather);
        info.getBride().setMother(brideMother);
        weddingInfoRepository.save(info);
    }

    public void updateAccounts(
        String groomBank, String groomAccountNumber, String groomOwner,
        String brideBank, String brideAccountNumber, String brideOwner
    ) {
        WeddingInfo info = get();
        info.getGroom().setAccountBank(groomBank);
        info.getGroom().setAccountNumber(groomAccountNumber);
        info.getGroom().setAccountOwner(groomOwner);
        info.getBride().setAccountBank(brideBank);
        info.getBride().setAccountNumber(brideAccountNumber);
        info.getBride().setAccountOwner(brideOwner);
        weddingInfoRepository.save(info);
    }

    public void addGalleryImage(String url) {
        WeddingInfo info = get();
        info.getGallery().add(url);
        weddingInfoRepository.save(info);
    }

    public void removeGalleryImage(int index) {
        WeddingInfo info = get();
        if (index >= 0 && index < info.getGallery().size()) {
            info.getGallery().remove(index);
            weddingInfoRepository.save(info);
        }
    }

    public void moveGalleryImage(int index, int direction) {
        WeddingInfo info = get();
        List<String> gallery = info.getGallery();
        int target = index + direction;
        if (index >= 0 && index < gallery.size() && target >= 0 && target < gallery.size()) {
            String tmp = gallery.get(index);
            gallery.set(index, gallery.get(target));
            gallery.set(target, tmp);
            weddingInfoRepository.save(info);
        }
    }

    public void addInterview() {
        WeddingInfo info = get();
        info.getInterview().add(new InterviewItem("", ""));
        weddingInfoRepository.save(info);
    }

    public void updateInterview(int index, String question, String answer) {
        WeddingInfo info = get();
        if (index >= 0 && index < info.getInterview().size()) {
            info.getInterview().set(index, new InterviewItem(question, answer));
            weddingInfoRepository.save(info);
        }
    }

    public void removeInterview(int index) {
        WeddingInfo info = get();
        if (index >= 0 && index < info.getInterview().size()) {
            info.getInterview().remove(index);
            weddingInfoRepository.save(info);
        }
    }

    public void addNotice() {
        WeddingInfo info = get();
        info.getNotices().add(new NoticeItem("", ""));
        weddingInfoRepository.save(info);
    }

    public void updateNotice(int index, String title, String content) {
        WeddingInfo info = get();
        if (index >= 0 && index < info.getNotices().size()) {
            info.getNotices().set(index, new NoticeItem(title, content));
            weddingInfoRepository.save(info);
        }
    }

    public void removeNotice(int index) {
        WeddingInfo info = get();
        if (index >= 0 && index < info.getNotices().size()) {
            info.getNotices().remove(index);
            weddingInfoRepository.save(info);
        }
    }

    public void addTransport() {
        WeddingInfo info = get();
        info.getTransportation().add(new TransportItem("", ""));
        weddingInfoRepository.save(info);
    }

    public void updateTransport(int index, String method, String description) {
        WeddingInfo info = get();
        if (index >= 0 && index < info.getTransportation().size()) {
            info.getTransportation().set(index, new TransportItem(method, description));
            weddingInfoRepository.save(info);
        }
    }

    public void removeTransport(int index) {
        WeddingInfo info = get();
        if (index >= 0 && index < info.getTransportation().size()) {
            info.getTransportation().remove(index);
            weddingInfoRepository.save(info);
        }
    }

    public void updateAnimation(boolean enabled, String text, String subtext) {
        WeddingInfo info = get();
        info.getOpeningAnimation().setEnabled(enabled);
        info.getOpeningAnimation().setText(text);
        info.getOpeningAnimation().setSubtext(subtext);
        weddingInfoRepository.save(info);
    }

    public void updateBgm(boolean enabled, String url, String title) {
        WeddingInfo info = get();
        info.getBgm().setEnabled(enabled);
        info.getBgm().setUrl(url);
        info.getBgm().setTitle(title);
        weddingInfoRepository.save(info);
    }
}
